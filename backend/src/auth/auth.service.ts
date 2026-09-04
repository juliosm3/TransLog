import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {RegisterDto} from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const usuarioExistente = await this.usersService.buscarPorEmail(registerDto.email);

        if (usuarioExistente) {
            throw new ConflictException('El email ya está registrado');
        }


        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        return this.usersService.crearUsuario({
            name: registerDto.name,
            email: registerDto.email,
            password: passwordHash,
            rol: registerDto.rol,
        });

    }

    async login(loginDto: LoginDto) {
        const usuario = await this.usersService.buscarPorEmail(loginDto.email);

        if (!usuario) {throw new ConflictException('Credenciales inválidas');
        }

        const passwordValido = await bcrypt.compare(loginDto.password, usuario.password);

        if (!passwordValido) {
            throw new ConflictException('Credenciales inválidas');
        }

        const token = this.jwtService.sign({ sub: usuario.id, email: usuario.email, rol: usuario.rol });

        return { access_token: token };
    }

}
