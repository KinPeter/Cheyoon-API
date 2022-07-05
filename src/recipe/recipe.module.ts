import { Module } from '@nestjs/common'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'
import { RecipeRepository } from './recipe.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { Recipe, RecipeSchema } from './recipe.schema'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeRepository],
})
export class RecipeModule {}
