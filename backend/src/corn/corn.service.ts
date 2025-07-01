import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CornPurchase } from './corn.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CornService {
  private readonly RATE_LIMIT_MS = 5000; //@TODO: Change to one minute: 60000;

  constructor(
    @InjectRepository(CornPurchase)
    private readonly cornRepository: Repository<CornPurchase>,
  ) {}

  async buyCorn(clientId: string): Promise<{ message: string }> {
    const lastPurchase = await this.cornRepository.findOne({
      where: { clientId },
      order: { purchaseTime: 'DESC' },
    });

    if (lastPurchase) {
      const now = Date.now();
      const lastTime = lastPurchase.purchaseTime.getTime();
      const elapsedMs = now - lastTime;

      if (elapsedMs < this.RATE_LIMIT_MS) {
        throw new Error(
          `Wait ${Math.ceil((this.RATE_LIMIT_MS - elapsedMs) / 1000)} seconds`,
        );
      }
    }

    const purchase = this.cornRepository.create({ clientId });
    await this.cornRepository.save(purchase);
    return { message: '🌽' };
  }

  async getPurchaseCount(clientId: string): Promise<{ count: number }> {
    const count = await this.cornRepository.count({
      where: { clientId },
    });
    return { count };
  }

  async getPurchaseInfo(clientId: string): Promise<{
    totalCount: number;
    lastPurchaseTime: Date | null;
    canBuyAgain: boolean;
    secondsUntilNextPurchase: number | null;
  }> {
    const [totalCount, lastPurchase] = await Promise.all([
      this.cornRepository.count({ where: { clientId } }),
      this.cornRepository.findOne({
        where: { clientId },
        order: { purchaseTime: 'DESC' },
      }),
    ]);

    if (!lastPurchase) {
      return {
        totalCount,
        lastPurchaseTime: null,
        canBuyAgain: true,
        secondsUntilNextPurchase: null,
      };
    }

    const now = Date.now();
    const lastPurchaseTime = lastPurchase.purchaseTime.getTime();
    const elapsedMs = now - lastPurchaseTime;

    // Debugging logs
    /*
    console.log('DEBUG - Current timestamp:', now);
    console.log('DEBUG - Last purchase timestamp:', lastPurchaseTime);
    console.log('DEBUG - Elapsed ms:', elapsedMs);
    */

    const canBuyAgain = elapsedMs > this.RATE_LIMIT_MS;
    const secondsUntilNextPurchase = canBuyAgain
      ? 0
      : Math.ceil((this.RATE_LIMIT_MS - elapsedMs) / 1000);

    return {
      totalCount,
      lastPurchaseTime: new Date(lastPurchaseTime),
      canBuyAgain,
      secondsUntilNextPurchase,
    };
  }

  async resetDatabase() {
    await this.cornRepository.clear();
    return { message: 'Database reset successfully' };
  }
}
