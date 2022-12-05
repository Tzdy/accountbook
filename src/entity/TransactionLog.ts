import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("transaction_log")
export class TransactionLog {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  from_account_type_id!: number;

  @Column()
  to_account_type_id!: number;

  // 手续费
  @Column()
  fee_number!: number;

  @Column()
  transaction_number!: number;

  @Column()
  created_time!: Date;

  @Column()
  description!: string;
}
