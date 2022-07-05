import { Injectable } from '@nestjs/common'
import { RecipeRepository } from './recipe.repository'
import { UUID } from '../common/uuid'
import { RecipeInput, RecipeListItem } from './recipe.dto'
import { Recipe } from './recipe.schema'

@Injectable()
export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  public async listUserRecipes(userId: UUID): Promise<RecipeListItem[]> {
    return this.recipeRepository.findAllForUser(userId)
  }

  public async getById(id: UUID, userId: string): Promise<Recipe> {
    return this.recipeRepository.findOne(id, userId)
  }

  public async createRecipe(userId: UUID, data: RecipeInput): Promise<Recipe> {
    return this.recipeRepository.create(userId, data)
  }

  public async updateRecipe(id: UUID, userId: UUID, data: RecipeInput): Promise<Recipe> {
    return this.recipeRepository.update(id, userId, data)
  }

  public async deleteRecipe(id: UUID, userId: UUID): Promise<void> {
    return this.recipeRepository.delete(id, userId)
  }
}
