import {
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
  async buyCorn(@Req() request: Request) {
    try {
      const clientId = request.ip || 'unknown';
      return await this.cornService.buyCorn(clientId);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Solo puedes comprar 1 mazorca por minuto',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  @Get('count')
  async getPurchaseCount(@Req() request: Request) {
    const clientId = request.ip || 'unknown';
    return this.cornService.getPurchaseCount(clientId);
  }

  @Get('info')
  async getPurchaseInfo(@Req() request: Request) {
    const clientId = request.ip || 'unknown';
    return this.cornService.getPurchaseInfo(clientId);
  }
}
