import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_day")
export class AccountDay {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  income!: number;

  @Column()
  spend!: number;

  @Column()
  created_time!: Date;

  @Column()
  updated_time!: Date;
}
