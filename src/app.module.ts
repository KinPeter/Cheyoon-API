import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.JC_MONGO_CONNECTION),
    UserModule,
    RecipeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
