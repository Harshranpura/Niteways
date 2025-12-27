import { Controller, Post, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post('signin')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Post('verify')
    async verify(@Body() verifyDto: VerifyDto) {
        return this.authService.verify(verifyDto);
    }

    @Get('users')
    async getAllUsers() {
        return this.authService.getAllUsers();
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() req) {
        return this.authService.getProfile(req.user.id);
    }

    @Put('profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(@Request() req, @Body() updateData: any) {
        return this.authService.updateProfile(req.user.id, updateData);
    }
}
