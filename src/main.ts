import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT ?? 3001
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Cheyoon API')
    .setDescription('REST endpoints for side projects')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port, '0.0.0.0', () => {
    new Logger('NestApplication').log(`App is listening on port ${port}`)
  })
}
bootstrap()
