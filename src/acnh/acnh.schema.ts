import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { UUID } from '../common/uuid'
import { ApiProperty } from '@nestjs/swagger'

export type AcnhDocument = AcnhData & Document

@Schema()
export class AcnhData {
  @ApiProperty()
  @Prop({ required: true })
  id: UUID

  @ApiProperty()
  @Prop({ required: true })
  updatedAt: Date

  @ApiProperty()
  @Prop({ required: true })
  userId: UUID

  @ApiProperty({ type: [Number] })
  @Prop({ type: [Number], required: true })
  villagers: number[]

  @ApiProperty({ type: [Number] })
  @Prop({ type: [Number], required: true })
  favorites: number[]
}

export const AcnhSchema = SchemaFactory.createForClass(AcnhData)
