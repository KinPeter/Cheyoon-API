import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { GetUser } from '../common/get-user.decorator'
import { UserDocument } from '../user/user.schema'
import { AuthGuard } from '@nestjs/passport'
import { AcnhData } from './acnh.schema'
import { AcnhService } from './acnh.service'
import { YupValidationPipe } from '../common/nestjs-yup/yup-validation.pipe'
import { VillagerIdInput } from './acnh.dto'

@ApiTags('ACNH')
@Controller('acnh')
export class AcnhController {
  constructor(private readonly acnhService: AcnhService) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the ACNH data for a user' })
  @ApiOkResponse({ type: AcnhData, description: 'The ACNH data' })
  @ApiNotFoundResponse({ description: 'Data not found' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async getDataForUser(@GetUser() user: UserDocument): Promise<AcnhData> {
    return this.acnhService.getDataForUser(user?.id)
  }

  @Post('/village/add')
  @HttpCode(201)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Add a villager to my village' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AcnhData, description: 'The ACNH data' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async addToVillage(
    @GetUser() user: UserDocument,
    @Body(YupValidationPipe) input: VillagerIdInput
  ): Promise<AcnhData> {
    return this.acnhService.addToVillagers(user.id, input.villagerId)
  }

  @Post('/village/remove')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Remove a villager from my village' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AcnhData, description: 'The ACNH data' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async removeFromVillage(
    @GetUser() user: UserDocument,
    @Body(YupValidationPipe) input: VillagerIdInput
  ): Promise<AcnhData> {
    return this.acnhService.removeFromVillagers(user.id, input.villagerId)
  }

  @Post('/favorites/add')
  @HttpCode(201)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Add a villager to my favorites' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AcnhData, description: 'The ACNH data' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async addToFavorites(
    @GetUser() user: UserDocument,
    @Body(YupValidationPipe) input: VillagerIdInput
  ): Promise<AcnhData> {
    return this.acnhService.addToFavorites(user.id, input.villagerId)
  }

  @Post('/favorites/remove')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Remove a villager from my favorites' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AcnhData, description: 'The ACNH data' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async removeFromFavorites(
    @GetUser() user: UserDocument,
    @Body(YupValidationPipe) input: VillagerIdInput
  ): Promise<AcnhData> {
    return this.acnhService.removeFromFavorites(user.id, input.villagerId)
  }
}
