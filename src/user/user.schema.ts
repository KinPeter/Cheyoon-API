import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { UUID } from '../common/uuid'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true })
  id: UUID

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  salt: string
}

export const UserSchema = SchemaFactory.createForClass(User)
