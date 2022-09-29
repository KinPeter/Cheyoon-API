import { Module } from '@nestjs/common'
import { AcnhController } from './acnh.controller'
import { AcnhService } from './acnh.service'
import { AcnhRepository } from './acnh.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { AcnhData, AcnhSchema } from './acnh.schema'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AcnhData.name, schema: AcnhSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AcnhController],
  providers: [AcnhService, AcnhRepository],
})
export class AcnhModule {}
