import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { VerifyDto } from './dto/verify.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async signUp(signUpDto: SignUpDto) {
        let { firstName, lastName, email, mobile, password, name, birthday, gender, location } = signUpDto;

        // Handle OTP/Mobile-first flow
        if (name && !firstName) {
            const parts = name.trim().split(' ');
            firstName = parts[0];
            lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
        }

        if (!email) {
            email = `${mobile}@nightclub.app`; // Dummy email for unique constraint
        }

        if (!password) {
            // Generate random strong password
            password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
        }

        // Check if user already exists by email OR mobile (since mobile is key now)
        const existingUser = await this.userRepository.findOne({
            where: [
                { email },
                { mobile }
            ]
        });

        if (existingUser) {
            throw new BadRequestException('User with this mobile/email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate custom user code (e.g., VK123456)
        const initials = ((firstName?.charAt(0) || 'U') + (lastName?.charAt(0) || 'U')).toUpperCase();
        const randomNumbers = Math.floor(100000 + Math.random() * 900000); // 6-digit number
        const userCode = `${initials}${randomNumbers}`;

        // Create new user
        const user = this.userRepository.create({
            firstName: firstName || 'User',
            lastName: lastName || '',
            email,
            mobile,
            password: hashedPassword,
            userCode,
            birthday: birthday ? new Date(birthday) : null,
            gender,
            location,
        });

        await this.userRepository.save(user);

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            message: 'Sign up successful',
            accessToken,
            user: {
                id: user.id,
                userCode: user.userCode,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                birthday: user.birthday,
                location: user.location,
            },
        };
    }

    async signIn(email: string, password: string) {
        // Find user by email
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                userCode: user.userCode,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                birthday: user.birthday,
                location: user.location,
            },
        };
    }

    async verify(verifyDto: VerifyDto) {
        const { mobile, code } = verifyDto;

        // Find user by mobile
        const user = await this.userRepository.findOne({ where: { mobile } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // For POC, accept any 6-digit code
        if (code.length !== 6) {
            throw new BadRequestException('Invalid verification code');
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                userCode: user.userCode,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                birthday: user.birthday,
                location: user.location,
            },
        };
    }


    async getProfile(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            userCode: user.userCode,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            gender: user.gender,
            birthday: user.birthday,
            location: user.location,
            createdAt: user.createdAt,
        };
    }

    async updateProfile(userId: string, updateData: any) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        console.log('Updating profile for user:', userId);
        console.log('Update data received:', updateData);

        // Update allowed fields - include explicit checks for null/undefined
        if (updateData.firstName !== undefined) user.firstName = updateData.firstName;
        if (updateData.lastName !== undefined) user.lastName = updateData.lastName;
        if (updateData.email !== undefined) user.email = updateData.email;
        if (updateData.mobile !== undefined) user.mobile = updateData.mobile;
        if (updateData.gender !== undefined) user.gender = updateData.gender;
        if (updateData.birthday !== undefined) user.birthday = updateData.birthday;
        if (updateData.location !== undefined) user.location = updateData.location;

        console.log('User object before save:', {
            gender: user.gender,
            birthday: user.birthday,
        });

        await this.userRepository.save(user);

        console.log('User saved successfully');

        return {
            id: user.id,
            userCode: user.userCode,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            gender: user.gender,
            birthday: user.birthday,
            location: user.location,
        };
    }

    async getAllUsers() {
        const users = await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
        return users.map(user => ({
            id: user.id,
            userCode: user.userCode,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            createdAt: user.createdAt,
        }));
    }
}
