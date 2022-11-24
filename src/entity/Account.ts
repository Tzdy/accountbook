import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account")
export class Account {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  account_day_id!: number;

  @Column()
  account_month_id!: number;

  @Column()
  account_number!: number;

  @Column()
  type!: number;

  @Column()
  detail_type_id!: number;

  @Column()
  created_time!: Date;

  @Column()
  description!: string;

  @Column()
  account_type_id!: number;
}
