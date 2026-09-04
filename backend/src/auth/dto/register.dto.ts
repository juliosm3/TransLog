import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { Rol } from '@prisma/client';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsOptional()
    @IsEnum(Rol)
    rol?: Rol;
}