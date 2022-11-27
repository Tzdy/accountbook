import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_type_month")
export class AccountTypeMonth {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  account_type_id!: number;

  @Column()
  total_account!: number;

  @Column()
  income!: number;

  @Column()
  spend!: number;

  @Column()
  created_time!: Date;

  @Column()
  updated_time!: Date;
}
