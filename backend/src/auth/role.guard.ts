import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request.user.rol !== 'SUPERVISOR') {
            throw new ForbiddenException('Sólo los supervisores pueden acceder a este recurso');
        }

        return true;
    }
}