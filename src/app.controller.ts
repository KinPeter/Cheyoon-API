import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Confirm the API is up and running' })
  @ApiOkResponse({ type: String, description: 'API is up and running' })
  getHello(): string {
    return this.appService.getHello()
  }
}
