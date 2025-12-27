import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    mobile: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    birthday: Date;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ nullable: true })
    fcmToken: string;

    @Column({ unique: true, nullable: true })
    userCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
