import { ApiProperty } from '@nestjs/swagger'
import { UseSchema } from '../common/nestjs-yup/useSchema.decorator'
import { RecipeInputSchema } from './recipe.validations'
import { UUID } from '../common/uuid'

export class Ingredient {
  @ApiProperty()
  amount: string

  @ApiProperty()
  unit: string

  @ApiProperty()
  material: string
}

export class RecipeBase {
  @ApiProperty()
  name: string

  @ApiProperty()
  photoUrl: string

  @ApiProperty()
  tags: string[]
}

@UseSchema(RecipeInputSchema)
export class RecipeInput extends RecipeBase {
  @ApiProperty()
  instructions: string

  @ApiProperty()
  servings: number

  @ApiProperty()
  ingredients: Ingredient[]
}

export class RecipeListItem extends RecipeBase {
  @ApiProperty()
  id: UUID

  @ApiProperty()
  updatedAt: Date
}
