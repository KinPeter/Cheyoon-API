import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from '../common/uuid'
import { AcnhRepository } from './acnh.repository'
import { AcnhData } from './acnh.schema'
import { ErrorCode } from '../common/error-codes'
import { AcnhErrorCodes } from './acnh-error-codes'
import { ACNH_VILLAGE_SIZE } from './acnh.constants'

@Injectable()
export class AcnhService {
  constructor(private readonly acnhRepository: AcnhRepository) {}

  public async getDataForUser(userId: UUID): Promise<AcnhData> {
    const data = await this.acnhRepository.findForUser(userId)
    if (!data) {
      return await this.acnhRepository.create(userId, { villagers: [], favorites: [] })
    }

    return data
  }

  public async addToFavorites(userId: UUID, villagerId: number): Promise<AcnhData> {
    const data = await this.acnhRepository.findForUser(userId)
    if (!data) {
      return await this.acnhRepository.create(userId, { villagers: [], favorites: [villagerId] })
    }
    if (data.favorites.includes(villagerId)) {
      throw new BadRequestException(AcnhErrorCodes.VILLAGER_ALREADY_ADDED)
    }

    await this.acnhRepository.update(data.id, userId, {
      villagers: data.villagers,
      favorites: [...data.favorites, villagerId],
    })

    return this.acnhRepository.findById(data.id)
  }

  public async removeFromFavorites(userId: UUID, villagerId: number): Promise<AcnhData> {
    const data = await this.acnhRepository.findForUser(userId)
    if (!data) {
      throw new NotFoundException(ErrorCode.ITEM_NOT_FOUND)
    }

    const newFavorites = [...data.favorites]
    const indexToDelete = newFavorites.indexOf(villagerId)
    if (indexToDelete === -1) {
      throw new NotFoundException(AcnhErrorCodes.VILLAGER_WAS_NOT_ON_LIST)
    }

    newFavorites.splice(indexToDelete, 1)

    await this.acnhRepository.update(data.id, userId, {
      villagers: data.villagers,
      favorites: newFavorites,
    })

    return this.acnhRepository.findById(data.id)
  }

  public async addToVillagers(userId: UUID, villagerId: number): Promise<AcnhData> {
    const data = await this.acnhRepository.findForUser(userId)
    if (!data) {
      return await this.acnhRepository.create(userId, { villagers: [villagerId], favorites: [] })
    }
    if (data.villagers.length >= ACNH_VILLAGE_SIZE) {
      throw new BadRequestException(AcnhErrorCodes.VILLAGE_FULL)
    }
    if (data.villagers.includes(villagerId)) {
      throw new BadRequestException(AcnhErrorCodes.VILLAGER_ALREADY_ADDED)
    }

    await this.acnhRepository.update(data.id, userId, {
      villagers: [...data.villagers, villagerId],
      favorites: data.favorites,
    })

    return this.acnhRepository.findById(data.id)
  }

  public async removeFromVillagers(userId: UUID, villagerId: number): Promise<AcnhData> {
    const data = await this.acnhRepository.findForUser(userId)
    if (!data) {
      throw new NotFoundException(ErrorCode.ITEM_NOT_FOUND)
    }

    const newVillagers = [...data.villagers]
    const indexToDelete = newVillagers.indexOf(villagerId)
    if (indexToDelete === -1) {
      throw new NotFoundException(AcnhErrorCodes.VILLAGER_WAS_NOT_ON_LIST)
    }
    newVillagers.splice(indexToDelete, 1)

    await this.acnhRepository.update(data.id, userId, {
      villagers: newVillagers,
      favorites: data.favorites,
    })

    return this.acnhRepository.findById(data.id)
  }

  public async deleteData(userId: UUID): Promise<void> {
    return this.acnhRepository.delete(userId)
  }
}
