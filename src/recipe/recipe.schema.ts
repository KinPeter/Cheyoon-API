import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { UUID } from '../common/uuid'
import { Ingredient } from './recipe.dto'
import { ApiProperty } from '@nestjs/swagger'

export type RecipeDocument = Recipe & Document

@Schema()
export class Recipe {
  @ApiProperty()
  @Prop({ required: true })
  id: UUID

  @ApiProperty()
  @Prop({ required: true })
  updatedAt: Date

  @ApiProperty()
  @Prop({ required: true })
  userId: UUID

  @ApiProperty()
  @Prop({ required: true })
  public: boolean

  @ApiProperty()
  @Prop({ required: true })
  name: string

  @ApiProperty()
  @Prop({ required: true })
  photoUrl: string

  @ApiProperty()
  @Prop({ required: true })
  instructions: string

  @ApiProperty()
  @Prop({ type: [String], required: true })
  tags: string[]

  @ApiProperty()
  @Prop({ required: true })
  servings: number

  @ApiProperty()
  @Prop({ required: true })
  cookingTime: string

  @ApiProperty({ type: [Ingredient] })
  @Prop({ required: true })
  ingredients: Ingredient[]
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe)
