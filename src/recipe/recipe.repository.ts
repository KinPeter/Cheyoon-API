import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuid } from 'uuid'
import { Recipe, RecipeDocument } from './recipe.schema'
import { UUID } from '../common/uuid'
import { RecipeInput } from './recipe.dto'

@Injectable()
export class RecipeRepository {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>) {}

  public async findAllForUser(userId: UUID): Promise<Recipe[]> {
    return await this.recipeModel
      .find({ userId }, ['id', 'updatedAt', 'name', 'photoUrl', 'tags'], {
        sort: { updatedAt: -1 },
      })
      .exec()
  }

  public async findOne(id: UUID, userId: UUID): Promise<Recipe> {
    return await this.recipeModel.findOne({ id, userId }).exec()
  }

  public async create(userId: UUID, data: RecipeInput): Promise<Recipe> {
    const document = new this.recipeModel({
      id: uuid(),
      userId,
      updatedAt: new Date(),
      ...data,
    })

    return await document.save()
  }

  public async update(id: UUID, userId: UUID, data: RecipeInput): Promise<Recipe> {
    return await this.recipeModel
      .findOneAndUpdate(
        {
          id,
          userId,
        },
        {
          ...data,
          updatedAt: new Date(),
        }
      )
      .exec()
  }

  public async delete(id: UUID, userId: UUID): Promise<void> {
    await this.recipeModel.findOneAndDelete({ id, userId }).exec()
  }
}
