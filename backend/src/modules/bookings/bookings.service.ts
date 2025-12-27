import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) { }

    async create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
        const booking = this.bookingsRepository.create({
            ...createBookingDto,
            userId,
            status: 'confirmed', // Auto-confirm for now
        });
        return this.bookingsRepository.save(booking);
    }

    async findAllByUser(userId: string): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { userId },
            order: { bookingDate: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Booking> {
        return this.bookingsRepository.findOne({
            where: { id, userId },
        });
    }

    async cancel(id: string, userId: string): Promise<void> {
        await this.bookingsRepository.update(
            { id, userId },
            { status: 'cancelled' }
        );
    }
}
