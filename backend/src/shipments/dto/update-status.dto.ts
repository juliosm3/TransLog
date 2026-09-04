import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShipmentStatus } from '@prisma/client';

export class UpdateStatusDto {
    @IsEnum(ShipmentStatus)
    estado!: ShipmentStatus;

    @IsString()
    ubicacion!: string;

    @IsOptional()
    @IsString()
    notas?: string;
}