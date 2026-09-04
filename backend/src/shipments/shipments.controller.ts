import { Body, Controller, Get, Param, Post, Query, UseGuards, Patch, Req, Delete } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ShipmentStatus } from '@prisma/client';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignVehiclesDto } from './dto/assign-vehicles.dto';

@Controller('shipments')
@UseGuards(AuthGuard)
export class ShipmentsController {
    constructor(private shipmentsService: ShipmentsService) {}

    @Post()
    crearEnvio(@Body() createShipmentDto: CreateShipmentDto) {
        return this.shipmentsService.crearEnvio(createShipmentDto);
    }

    @Get()
    listarEnvios(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('estado') estado?: ShipmentStatus
    ) {
        return this.shipmentsService.listarEnvios(
            Number(page) || 1,
            Number(limit) || 10,
            estado
        );
    }

    @Get(':id')
    obtenerEnvio(@Param('id') id: string) {
        return this.shipmentsService.obtenerEnvio(id);
    }

    @Patch(':id/status')
    actualizarEstado(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateStatusDto,
        @Req() req: any
    ) {
        return this.shipmentsService.actualizarEstado(id, updateStatusDto, req.user.sub);
    }

    @Delete(':id')
    cancelarEnvio(@Param('id') id: string) {
        return this.shipmentsService.cancelarEnvio(id);
    }

    @Post('assign-vehicles')
    asignarVehiculos(@Body() assignVehiclesDto: AssignVehiclesDto) {
        return this.shipmentsService.asignarVehiculos(assignVehiclesDto);
    }

}