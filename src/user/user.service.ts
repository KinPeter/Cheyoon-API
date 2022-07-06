import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {
  AuthRequest,
  JwtDecodedToken,
  LoginResponse,
  TokenResponse,
  UpdatePasswordRequest,
} from './user.dto'
import { UsersRepository } from './user.repository'
import { ErrorCode } from '../common/error-codes'
import { UserDocument } from './user.schema'
import { UUID } from '../common/uuid'
import { IdResponse } from '../common/id-response'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository
  ) {}

  public async signUp(data: AuthRequest): Promise<IdResponse> {
    const user = await this.createInitialUserDocument(data)

    const exists = await this.usersRepository.findUserByEmail(data.email)
    if (exists) {
      throw new ConflictException(ErrorCode.EMAIL_REGISTERED)
    }

    const result = await this.usersRepository.saveUser(user)

    this.logger.log(`User signed up: ${result.email} (id: ${result.id})`)

    return { id: result.id }
  }

  public async login({ email, password }: AuthRequest): Promise<LoginResponse> {
    const user = await this.usersRepository.findUserByEmail(email)
    const validated = !!user
      ? await this.validatePassword(password, user.salt, user.password)
      : false

    if (!user || !validated) {
      throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS)
    }

    const accessToken = this.jwtService.sign({ email })
    const expiresAt = (this.jwtService.decode(accessToken) as JwtDecodedToken).exp * 1000

    this.logger.log(`User logged in: ${user.email} (id: ${user.id})`)

    return {
      token: accessToken,
      expiresAt,
      id: user.id,
      email: user.email,
    }
  }

  public async refreshToken(userId: UUID): Promise<TokenResponse> {
    const user = await this.usersRepository.findUserById(userId)
    const token = this.jwtService.sign({ email: user.email })
    const expiresAt = (this.jwtService.decode(token) as JwtDecodedToken).exp * 1000
    return {
      token,
      expiresAt,
    }
  }

  public async changePassword(
    user: UserDocument,
    { oldPassword, password }: UpdatePasswordRequest
  ): Promise<void> {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const isOldPasswordValid = await this.validatePassword(oldPassword, user.salt, user.password)
    if (!isOldPasswordValid) {
      throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS)
    }

    await this.usersRepository.updatePassword(user.id, hashedPassword, salt)
    this.logger.log(`User changed password (id: ${user.id})`)
  }

  public async deleteUser(userId: UUID): Promise<void> {
    await this.usersRepository.deleteUser(userId)
    this.logger.log(`User account deleted (id: ${userId})`)
  }

  private async createInitialUserDocument(userSignupDto: AuthRequest): Promise<UserDocument> {
    const { email, password } = userSignupDto
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    return this.usersRepository.createNewUserDocument(email, hashedPassword, salt)
  }

  private async validatePassword(
    password: string,
    salt: string,
    hashedPassword: string
  ): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt)
    return hash === hashedPassword
  }
}
