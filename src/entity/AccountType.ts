import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_type")
export class AccountType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  is_allow_debt!: number;

  @Column()
  number!: number;
}
