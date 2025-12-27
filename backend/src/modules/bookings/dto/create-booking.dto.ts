import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    venueId: string;

    @IsString()
    @IsOptional()
    venueName?: string;

    @IsString()
    @IsOptional()
    venueImage?: string;

    @IsString()
    @IsOptional()
    eventId?: string;

    @IsDateString()
    @IsNotEmpty()
    bookingDate: string;

    @IsNumber()
    @IsOptional()
    numberOfGuests?: number;

    @IsString()
    @IsOptional()
    tableNumber?: string;

    @IsNumber()
    @IsOptional()
    totalAmount?: number;
}
