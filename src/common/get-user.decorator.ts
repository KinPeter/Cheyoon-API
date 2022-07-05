import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserDocument } from '../user/user.schema'

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const req = ctx.switchToHttp().getRequest()
    return req.user
  }
)
