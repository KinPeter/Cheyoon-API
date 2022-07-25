import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuid } from 'uuid'
import { Recipe, RecipeDocument } from './recipe.schema'
import { UUID } from '../common/uuid'
import { RecipeInput } from './recipe.dto'
import { IdResponse } from '../common/id-response'
import { ErrorCode } from '../common/error-codes'

@Injectable()
export class RecipeRepository {
  private readonly listProperties = ['id', 'updatedAt', 'name', 'photoUrl', 'tags', 'cookingTime']

  constructor(@InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>) {}

  public async findAllPublic(): Promise<Recipe[]> {
    return await this.recipeModel
      .find({ public: true }, this.listProperties, {
        sort: { updatedAt: -1 },
      })
      .exec()
  }

  public async findRecentPublic(): Promise<Recipe[]> {
    return await this.recipeModel
      .find({ public: true }, this.listProperties, {
        sort: { updatedAt: -1 },
        limit: 6,
      })
      .exec()
  }

  public async findAllForUser(userId: UUID): Promise<Recipe[]> {
    return await this.recipeModel
      .find({ userId }, this.listProperties, {
        sort: { updatedAt: -1 },
      })
      .exec()
  }

  public async findOne(id: UUID): Promise<Recipe> {
    const document = await this.recipeModel.findOne({ id }).exec()
    if (!document) {
      throw new NotFoundException(ErrorCode.ITEM_NOT_FOUND)
    }
    return document
  }

  public async create(userId: UUID, data: RecipeInput): Promise<IdResponse> {
    const document = new this.recipeModel({
      id: uuid(),
      userId,
      updatedAt: new Date(),
      ...data,
    })
    await document.save()
    return { id: document.id }
  }

  public async update(id: UUID, userId: UUID, data: RecipeInput): Promise<IdResponse> {
    const document = await this.recipeModel
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
    if (!document) {
      throw new NotFoundException(ErrorCode.ITEM_NOT_FOUND)
    }
    return { id: document.id }
  }

  public async delete(id: UUID, userId: UUID): Promise<void> {
    const document = await this.recipeModel.findOneAndDelete({ id, userId }).exec()
    if (!document) {
      throw new NotFoundException(ErrorCode.ITEM_NOT_FOUND)
    }
  }
}
