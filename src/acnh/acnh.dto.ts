import { UseSchema } from '../common/nestjs-yup/useSchema.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { AcnhInputSchema, VillagerIdInputSchema } from './acnh.validations'

@UseSchema(AcnhInputSchema)
export class AcnhInput {
  @ApiProperty({ type: [Number] })
  villagers: number[]

  @ApiProperty({ type: [Number] })
  favorites: number[]
}

@UseSchema(VillagerIdInputSchema)
export class VillagerIdInput {
  @ApiProperty()
  villagerId: number
}
