import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_detail_type")
export class AccountDetailType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  detail_sort_id!: number;

  @Column()
  account_type!: number;

  @Column()
  name!: string;
}