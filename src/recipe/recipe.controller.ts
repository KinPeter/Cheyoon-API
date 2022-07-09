import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { RecipeService } from './recipe.service'
import { GetUser } from '../common/get-user.decorator'
import { UserDocument } from '../user/user.schema'
import { RecipeInput, RecipeListItem } from './recipe.dto'
import { AuthGuard } from '@nestjs/passport'
import { UUID } from '../common/uuid'
import { Recipe } from './recipe.schema'
import { YupValidationPipe } from '../common/nestjs-yup/yup-validation.pipe'
import { IdResponse } from '../common/id-response'

@ApiTags('Recipes')
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/list')
  @ApiOperation({ summary: 'List base info of all public recipes' })
  @ApiOkResponse({ type: [RecipeListItem], description: 'List of recipes' })
  public async listAllPublic(): Promise<RecipeListItem[]> {
    return this.recipeService.listPublicRecipes()
  }

  @Get('/my-list')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'List base info of recipes for a user' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: [RecipeListItem], description: 'List of recipes' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async listForUser(@GetUser() user: UserDocument): Promise<RecipeListItem[]> {
    return this.recipeService.listUserRecipes(user.id)
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get a recipe with all details by ID' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe, description: 'A recipe' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async getById(@GetUser() user: UserDocument, @Param('id') id: UUID): Promise<Recipe> {
    return this.recipeService.getById(id, user.id)
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe, description: 'Recipe created' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async create(
    @GetUser() user: UserDocument,
    @Body(YupValidationPipe) data: RecipeInput
  ): Promise<IdResponse> {
    return this.recipeService.createRecipe(user.id, data)
  }

  @Put('/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe, description: 'Recipe updated' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async update(
    @GetUser() user: UserDocument,
    @Body(YupValidationPipe) data: RecipeInput,
    @Param('id') id: UUID
  ): Promise<IdResponse> {
    return this.recipeService.updateRecipe(id, user.id, data)
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe, description: 'Recipe deleted' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User has no access rights to the requested content' })
  public async delete(@GetUser() user: UserDocument, @Param('id') id: UUID): Promise<void> {
    return this.recipeService.deleteRecipe(id, user.id)
  }
}
