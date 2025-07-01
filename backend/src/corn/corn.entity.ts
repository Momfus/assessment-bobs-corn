import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class CornPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  clientId: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  purchaseTime: Date;
}
