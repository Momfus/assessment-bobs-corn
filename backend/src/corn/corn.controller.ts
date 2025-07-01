import {
  Body,
  Controller,
  Post,
  Req,
  HttpException,
  HttpStatus,
  Get,
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
          error: 'Solo puedes comprar despues que termine el tiempo de espera',
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
    @Req() request: Request,
    @Body() body: { clientId?: string },
  ) {
    const clientId = body.clientId || request.ip || 'unknown';
    return this.cornService.getPurchaseInfo(clientId);
  }
}
