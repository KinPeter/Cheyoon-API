import { Body, Controller, Delete, HttpCode, Post, Put, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import {
  AuthRequest,
  LoginResponse,
  SignupResponse,
  TokenResponse,
  UpdatePasswordRequest,
} from './user.dto'
import { UserDocument } from './user.schema'
import { GetUser } from '../common/get-user.decorator'
import { AuthGuard } from '@nestjs/passport'
import { YupValidationPipe } from '../common/nestjs-yup/yup-validation.pipe'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@ApiTags('Users & Auth')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/signup')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({ type: SignupResponse, description: 'User is created' })
  @ApiConflictResponse({ description: 'Email is already registered' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  signUp(@Body(YupValidationPipe) data: AuthRequest): Promise<SignupResponse> {
    return this.usersService.signUp(data)
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log a user in' })
  @ApiOkResponse({ type: LoginResponse, description: 'Logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  login(@Body(YupValidationPipe) data: AuthRequest): Promise<LoginResponse> {
    return this.usersService.login(data)
  }

  @Post('/token-refresh')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Create a new access token for a user' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: TokenResponse, description: 'Token refreshed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  refreshToken(@GetUser() user: UserDocument): Promise<TokenResponse> {
    return this.usersService.refreshToken(user.id)
  }

  @Put('/change-password')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Change the password of a user' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Password changed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  changePassword(
    @GetUser() user: UserDocument,
    @Body(YupValidationPipe) data: UpdatePasswordRequest
  ): Promise<void> {
    return this.usersService.changePassword(user, data)
  }

  @Delete()
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Delete a user account' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Account deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  deleteAccount(@GetUser() user: UserDocument): Promise<void> {
    return this.usersService.deleteUser(user.id)
  }
}
