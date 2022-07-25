import { ForbiddenException, Injectable } from '@nestjs/common'
import { RecipeRepository } from './recipe.repository'
import { UUID } from '../common/uuid'
import { RecipeInput, RecipeListItem } from './recipe.dto'
import { Recipe } from './recipe.schema'
import { IdResponse } from '../common/id-response'

@Injectable()
export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  public async listPublicRecipes(): Promise<RecipeListItem[]> {
    return this.recipeRepository.findAllPublic()
  }

  public async listRecentRecipes(): Promise<RecipeListItem[]> {
    return this.recipeRepository.findRecentPublic()
  }

  public async listUserRecipes(userId: UUID): Promise<RecipeListItem[]> {
    return this.recipeRepository.findAllForUser(userId)
  }

  public async getById(id: UUID, userId: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne(id)

    if (!recipe.public && userId !== recipe.userId) {
      throw new ForbiddenException()
    }

    return recipe
  }

  public async createRecipe(userId: UUID, data: RecipeInput): Promise<IdResponse> {
    return this.recipeRepository.create(userId, data)
  }

  public async updateRecipe(id: UUID, userId: UUID, data: RecipeInput): Promise<IdResponse> {
    return this.recipeRepository.update(id, userId, data)
  }

  public async deleteRecipe(id: UUID, userId: UUID): Promise<void> {
    return this.recipeRepository.delete(id, userId)
  }
}
