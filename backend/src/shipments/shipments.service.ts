import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentStatus } from '@prisma/client';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignVehiclesDto } from './dto/assign-vehicles.dto';

@Injectable()
export class ShipmentsService {
    constructor(private prisma: PrismaService) {}

    private generarTrackingCode() {
        const fecha = new Date().toISOString().slice(0, 10).replaceAll('-', '');
        const numero = Math.floor(1000 + Math.random() * 9000);

        return `ENV-${fecha}-${numero}`;
    }

    crearEnvio(createShipmentDto: CreateShipmentDto) {
        const trackingCode = this.generarTrackingCode();

        return this.prisma.shipment.create({
            data: {
                ...createShipmentDto,
                trackingCode,
            },
        });
    }

    listarEnvios(page = 1, limit = 10, estado?: ShipmentStatus) {
        const skip = (page - 1) * limit;

        return this.prisma.shipment.findMany({
            skip,
            take: limit,
            where: estado ? { estado } : undefined,
        });
    }

    obtenerEnvio(id: string) {
        return this.prisma.shipment.findUnique({
            where: { id },
            include: { events: true },
        });
    }

    async actualizarEstado(id: string, updateStatusDto: UpdateStatusDto, userId: number) {
        const envio = await this.prisma.shipment.findUnique({
            where: { id },
        });

        if (!envio) {
            throw new NotFoundException('Envío no encontrado');
        }

        let cambioValido = false;

        if (envio.estado === 'CREATED' && updateStatusDto.estado === 'IN_WAREHOUSE') {
            cambioValido = true;
        }

        if (envio.estado === 'IN_WAREHOUSE' && updateStatusDto.estado === 'IN_TRANSIT') {
            cambioValido = true;
        }

        if (envio.estado === 'IN_TRANSIT' && updateStatusDto.estado === 'OUT_FOR_DELIVERY') {
            cambioValido = true;
        }

        if (envio.estado === 'OUT_FOR_DELIVERY' && updateStatusDto.estado === 'DELIVERED') {
            cambioValido = true;
        }

        if (envio.estado === 'OUT_FOR_DELIVERY' && updateStatusDto.estado === 'RETURNED') {
            cambioValido = true;
        }

        if (updateStatusDto.estado === 'CANCELLED' && envio.estado !== 'DELIVERED') {
            cambioValido = true;
        }

        if (!cambioValido) {
            throw new BadRequestException('Cambio de estado no válido');
        }

        if (updateStatusDto.estado === 'DELIVERED') {
            await this.prisma.shipment.update({
                where: { id },
                data: {
                    estado: updateStatusDto.estado,
                    fechaEntrega: new Date(),
                },
            });
        } else {
            await this.prisma.shipment.update({
                where: { id },
                data: {
                    estado: updateStatusDto.estado,
                },
            });
        }

        await this.prisma.shipmentEvent.create({
            data: {
                shipmentId: id,
                estado: updateStatusDto.estado,
                ubicacion: updateStatusDto.ubicacion,
                notas: updateStatusDto.notas,
                userId: userId,
            },
        });

        return { message: 'Estado del envío actualizado correctamente' };
    }

    async cancelarEnvio(id: string) {
        const envio = await this.prisma.shipment.findUnique({
            where: { id },
        });

        if (!envio) {
            throw new NotFoundException('Envío no encontrado');
        }

        if (envio.estado === 'DELIVERED') {
            throw new BadRequestException('No se puede cancelar un envío entregado');
        }

        return this.prisma.shipment.update({
            where: { id },
            data: {
                estado: 'CANCELLED',
            },
        });
    }

    obtenerTracking(trackingCode: string) {
        return this.prisma.shipment.findUnique({
            where: { trackingCode },
            include: { events: true },
        });
    }

    async asignarVehiculos(assignVehiclesDto: AssignVehiclesDto) {
        const envios = await this.prisma.shipment.findMany({
            where: {
                id: {
                    in: assignVehiclesDto.shipmentIds,
                },
            },
        });

        if (envios.length !== assignVehiclesDto.shipmentIds.length) {
            throw new BadRequestException('Algún envío no existe');
        }

        for (const envio of envios) {
            if (envio.estado !== 'IN_WAREHOUSE') {
                throw new BadRequestException('Todos los envíos deben estar en almacén');
            }

            if (envio.peso > assignVehiclesDto.vehicleCapacity) {
                throw new BadRequestException('Un envío supera la capacidad del vehículo');
            }
        }

        envios.sort((a, b) => b.peso - a.peso);

        const vehiculos: any[] = [];

        for (const envio of envios) {
            let asignado = false;

            for (const vehiculo of vehiculos) {
                if (envio.peso <= vehiculo.remainingCapacity) {
                    vehiculo.shipments.push(envio.id);
                    vehiculo.totalWeight += envio.peso;
                    vehiculo.remainingCapacity -= envio.peso;
                    asignado = true;
                    break;
                }
            }

            if (!asignado) {
                vehiculos.push({
                    shipments: [envio.id],
                    totalWeight: envio.peso,
                    remainingCapacity: assignVehiclesDto.vehicleCapacity - envio.peso,
                });
            }
        }

        return {
            vehicles: vehiculos,
            totalVehiclesUsed: vehiculos.length,
        };
    }
}