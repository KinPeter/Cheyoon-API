import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { Model } from 'mongoose'
import { v4 as uuid } from 'uuid'

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec()
  }

  public async findUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findOne({ id }).exec()
  }

  public async saveUser(user: UserDocument): Promise<UserDocument> {
    return await user.save()
  }

  public createNewUserDocument(email: string, password: string, salt: string): UserDocument {
    return new this.userModel({
      id: uuid(),
      email,
      password,
      salt,
    })
  }

  public async updatePassword(id: string, password: string, salt: string): Promise<void> {
    const user = await this.userModel
      .findOneAndUpdate(
        { id },
        {
          password,
          salt,
        }
      )
      .exec()
    if (!user) {
      throw new NotFoundException()
    }
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findOneAndDelete({ id }).exec()
    if (!user) {
      throw new NotFoundException()
    }
  }
}
