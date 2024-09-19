/**
 * 用户实体
 */
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'date', name: 'create_time' })
  create_time!: string

  @PrimaryColumn()
  user_name!: string

  @Column()
  user_pwd!: string

  @Column()
  nickName!: string

  @Column()
  user_email!: string

  @Column()
  user_avatar!: string
}
