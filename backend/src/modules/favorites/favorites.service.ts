import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private favoritesRepository: Repository<Favorite>,
    ) { }

    async create(userId: string, venueId: string, venueName?: string, venueImage?: string): Promise<Favorite> {
        const existing = await this.favoritesRepository.findOne({
            where: { userId, venueId },
        });

        if (existing) {
            return existing;
        }

        const favorite = this.favoritesRepository.create({
            userId,
            venueId,
            venueName,
            venueImage,
        });
        return this.favoritesRepository.save(favorite);
    }

    async findAllByUser(userId: string): Promise<Favorite[]> {
        return this.favoritesRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async remove(userId: string, venueId: string): Promise<void> {
        await this.favoritesRepository.delete({ userId, venueId });
    }

    async isFavorite(userId: string, venueId: string): Promise<boolean> {
        const count = await this.favoritesRepository.count({
            where: { userId, venueId },
        });
        return count > 0;
    }
}
