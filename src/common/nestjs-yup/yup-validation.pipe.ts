import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { ValidationError } from 'yup'

interface Error {
  path: string
  message: string
}

/**
 * Handle Error Message
 * @param err
 */
const serializeValidationError = (err: ValidationError) => {
  const invalid: Error[] = err.inner.map(({ path, message }) => ({
    path,
    message,
  }))

  return invalid
}

@Injectable()
export class YupValidationPipe implements PipeTransform {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    const { schema } = metatype?.prototype
    if (!schema) return value

    try {
      await schema.validate(value, { abortEarly: false })
    } catch (err) {
      throw new BadRequestException(serializeValidationError(err))
    }
    return value
  }
}
