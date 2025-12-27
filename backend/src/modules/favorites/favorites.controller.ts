import { Controller, Get, Post, Delete, Param, UseGuards, Request, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Post()
    create(@Request() req, @Body() body: { venueId: string; venueName?: string; venueImage?: string }) {
        return this.favoritesService.create(req.user.userId, body.venueId, body.venueName, body.venueImage);
    }

    @Get()
    findAll(@Request() req) {
        return this.favoritesService.findAllByUser(req.user.userId);
    }

    @Delete(':venueId')
    remove(@Request() req, @Param('venueId') venueId: string) {
        return this.favoritesService.remove(req.user.userId, venueId);
    }

    @Get('check/:venueId')
    check(@Request() req, @Param('venueId') venueId: string) {
        return this.favoritesService.isFavorite(req.user.userId, venueId);
    }
}
