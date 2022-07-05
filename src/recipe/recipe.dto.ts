import { ApiProperty } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { UseSchema } from '../common/nestjs-yup/useSchema.decorator'
import { RecipeInputSchema } from './recipe.validations'

export class Ingredient {
  @ApiProperty()
  amount: string

  @ApiProperty()
  unit: string

  @ApiProperty()
  material: string
}

@UseSchema(RecipeInputSchema)
export class RecipeInput {
  @ApiProperty()
  name: string

  @ApiProperty()
  instructions: string

  @ApiProperty()
  tags: string[]

  @ApiProperty()
  servings: number

  @ApiProperty()
  ingredients: Ingredient[]
}
