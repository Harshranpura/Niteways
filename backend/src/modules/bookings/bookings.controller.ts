import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user.userId, createBookingDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.bookingsService.findAllByUser(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.bookingsService.findOne(id, req.user.userId);
    }

    @Delete(':id')
    cancel(@Request() req, @Param('id') id: string) {
        return this.bookingsService.cancel(id, req.user.userId);
    }
}
