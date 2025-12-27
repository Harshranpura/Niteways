import { IsString, IsNotEmpty, IsEmail, Matches, MinLength, MaxLength, IsOptional } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    name?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{10,15}$/, { message: 'Mobile number must be 10-15 digits' })
    mobile: string;

    @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(100)
    password?: string;

    @IsString()
    @IsOptional()
    birthday?: string;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    location?: string;
}
