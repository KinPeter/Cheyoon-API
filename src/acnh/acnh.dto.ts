import { UseSchema } from '../common/nestjs-yup/useSchema.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { AcnhInputSchema, VillagerIdInputSchema } from './acnh.validations'

@UseSchema(AcnhInputSchema)
export class AcnhInput {
  @ApiProperty({ type: [String] })
  villagers: string[]

  @ApiProperty({ type: [String] })
  favorites: string[]
}

@UseSchema(VillagerIdInputSchema)
export class VillagerIdInput {
  @ApiProperty()
  villagerId: string
}
