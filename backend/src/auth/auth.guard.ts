import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Token no proporcionado');
        }

        const token = authHeader.split(' ')[1];

        try {
            const usuario = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET, });

            request.user = usuario;
            return true;
        } catch {
            throw new UnauthorizedException('Token inválido');
        }
    }
}