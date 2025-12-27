import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        // Don't return password field
        return this.usersRepository.find({
            select: ['id', 'firstName', 'lastName', 'email', 'mobile', 'location', 'gender', 'createdAt', 'updatedAt'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<User> {
        return this.usersRepository.findOne({
            where: { id },
            select: ['id', 'firstName', 'lastName', 'email', 'mobile', 'location', 'gender', 'birthday', 'createdAt', 'updatedAt'],
        });
    }

    async update(id: string, updateData: Partial<User>): Promise<User> {
        // Don't allow password updates through this endpoint
        delete updateData.password;
        await this.usersRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
