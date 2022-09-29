import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { v4 as uuid } from 'uuid'
import { Model } from 'mongoose'
import { UUID } from '../common/uuid'
import { AcnhData, AcnhDocument } from './acnh.schema'
import { AcnhInput } from './acnh.dto'
import { ErrorCode } from '../common/error-codes'

@Injectable()
export class AcnhRepository {
  constructor(@InjectModel(AcnhData.name) private acnhModel: Model<AcnhDocument>) {}

  public async findForUser(userId: UUID): Promise<AcnhData> {
    return await this.acnhModel.findOne({ userId }).exec()
  }

  public async findById(id: UUID): Promise<AcnhData> {
    return await this.acnhModel.findOne({ id }).exec()
  }

  public async create(userId: UUID, data: AcnhInput): Promise<AcnhData> {
    const document = new this.acnhModel({
      id: uuid(),
      userId,
      updatedAt: new Date(),
      ...data,
    })
    await document.save()
    return document
  }

  public async update(id: UUID, userId: UUID, data: AcnhInput): Promise<AcnhData> {
    const document = await this.acnhModel
      .findOneAndUpdate(
        {
          id,
          userId,
        },
        {
          ...data,
          updatedAt: new Date(),
        }
      )
      .exec()
    if (!document) {
      throw new NotFoundException(ErrorCode.ITEM_NOT_FOUND)
    }
    return document
  }

  public async delete(userId: UUID): Promise<void> {
    const document = await this.acnhModel.findOneAndDelete({ userId }).exec()
    if (!document) {
      throw new NotFoundException(ErrorCode.ITEM_NOT_FOUND)
    }
  }
}
