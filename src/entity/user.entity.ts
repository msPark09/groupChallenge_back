import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { BasicEntity } from './basic.entity';

@Entity({ name: 'users' })
export class User extends BasicEntity {
  
  @PrimaryColumn({name:"user_id"})
  userId: string;

  // TODO entity column name check
  @Column({name:"user_name"})
  userName: string;

  @Column({nullable: false})
  password: string;
  
  // 저장 전에 암호화
  // @BeforeInsert()
  // @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      
      this.password = await bcrypt.hash(this.password, 10); // 10은 round값 2^10
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
      throw new InternalServerErrorException({
        ...error.response,
      });
    }
  }

  @Column()
  email: string;

  @Column({name:"say_word"})
  sayWord: string;

}