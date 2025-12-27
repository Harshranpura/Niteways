import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('favorites')
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    venueId: string;

    @Column({ nullable: true })
    venueName: string;

    @Column({ nullable: true })
    venueImage: string;

    @CreateDateColumn()
    createdAt: Date;
}
