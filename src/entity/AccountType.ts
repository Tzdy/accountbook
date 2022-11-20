import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_type")
export class AccountType {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  account_type_sort_id!: number;

  @Column()
  account_type_template_id!: number;

  @Column()
  name!: string;

  @Column()
  number!: number;
}
