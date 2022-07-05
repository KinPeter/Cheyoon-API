import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UsersRepository } from './user.repository'
import { JwtPayload } from './user.dto'
import { UserDocument } from './user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JC_JWT_SECRET,
    })
  }

  async validate({ email }: JwtPayload): Promise<UserDocument> {
    const user = await this.usersRepository.findUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
