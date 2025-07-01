import {
  Body,
  Controller,
  Post,
  Req,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { CornService } from './corn.service';
import { Request } from 'express';

@Controller('corn')
export class CornController {
  constructor(private readonly cornService: CornService) {}

  @Post()
  async buyCorn(@Req() request: Request, @Body() body: { clientId?: string }) {
    try {
      const clientId = body.clientId || request.ip || 'unknown';
      return await this.cornService.buyCorn(clientId);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.TOO_MANY_REQUESTS,
          error:
            'You can only make a purchase once the waiting time is finished.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  @Get('count')
  async getPurchaseCount(
    @Req() request: Request,
    @Body() body: { clientId?: string },
  ) {
    const clientId = body.clientId || request.ip || 'unknown';
    return this.cornService.getPurchaseCount(clientId);
  }

  @Get('info')
  async getPurchaseInfo(
    @Query('clientId') clientId: string,
    @Req() request: Request,
  ) {
    const finalClientId = clientId || request.ip || 'unknown';
    return this.cornService.getPurchaseInfo(finalClientId);
  }
}
