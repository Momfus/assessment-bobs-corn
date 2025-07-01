import { Controller, Post } from '@nestjs/common';
import { CornService } from '../corn/corn.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly cornService: CornService) {}

  @Post('reset-db')
  async resetDatabase() {
    return this.cornService.resetDatabase();
  }
}
