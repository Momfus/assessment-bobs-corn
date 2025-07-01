export interface PurchaseInfo {
  totalCount: number;
  secondsUntilNextPurchase?: number;
  lastPurchaseTime: Date | null;
}
