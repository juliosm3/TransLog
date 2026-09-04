import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    Min,
} from 'class-validator';

export class CreateShipmentDto {
    @IsNotEmpty()
    @IsString()
    direccionOrigen!: string;

    @IsNotEmpty()
    @IsString()
    direccionDestino!: string;

    @IsNotEmpty()
    @IsString()
    nombreDestinatario!: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsNumber()
    @Min(0.01)
    peso!: number;
}