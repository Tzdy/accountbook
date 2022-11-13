import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_familymember")
export class AccountFamilyMember {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  account_id!: number;

  @Column()
  familymember_id!: number;

  @Column()
  // 0 收入 1 支出
  type!: number;

  @Column()
  number!: number;
}
