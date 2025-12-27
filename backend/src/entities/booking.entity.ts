import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('bookings')
export class Booking {
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

    @Column({ nullable: true })
    eventId: string;

    @Column({ type: 'timestamp' })
    bookingDate: Date;

    @Column({ default: 'pending' })
    status: string; // pending, confirmed, cancelled

    @Column({ default: 1 })
    numberOfGuests: number;

    @Column({ nullable: true })
    tableNumber: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    totalAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
