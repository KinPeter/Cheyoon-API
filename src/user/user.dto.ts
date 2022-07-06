import { UUID } from '../common/uuid'
import { UseSchema } from '../common/nestjs-yup/useSchema.decorator'
import { AuthSchema, UpdatePasswordSchema } from './user.validations'
import { ApiProperty } from '@nestjs/swagger'

@UseSchema(AuthSchema)
export class AuthRequest {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string
}

export class TokenResponse {
  @ApiProperty()
  token: string

  @ApiProperty()
  expiresAt: number
}

export class LoginResponse extends TokenResponse {
  @ApiProperty()
  email: string

  @ApiProperty()
  id: UUID
}

@UseSchema(UpdatePasswordSchema)
export class UpdatePasswordRequest {
  @ApiProperty()
  oldPassword: string

  @ApiProperty()
  password: string
}

export interface JwtPayload {
  userId: UUID
  email: string
}

export interface JwtDecodedToken {
  email: string
  iat: number
  exp: number
}
