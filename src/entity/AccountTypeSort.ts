import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_type_sort")
export class AccountTypeSort {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  name!: string;

  @Column()
  is_allow_debt!: number;
}
