import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Rol } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    buscarPorEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }


crearUsuario(data: { 
    name: string; 
    email: string; 
    password: string; 
    rol?: Rol;
}) {
    return this.prisma.user.create({
        data,
        });
    }
}