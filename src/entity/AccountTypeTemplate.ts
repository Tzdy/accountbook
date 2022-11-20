import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_type_template")
export class AccountTypeTemplate {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  account_type_sort_id!: number;

  @Column()
  name!: string;

  @Column()
  icon!: string;
}
