import { BadRequestException } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';

describe('ShipmentsService', () => {
    let service: ShipmentsService;
    let prisma: any;

    beforeEach(() => {
        prisma = {
            shipment: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
            },
            shipmentEvent: {
                create: jest.fn(),
            },
        };

        service = new ShipmentsService(prisma);
    });

    it('no permite un cambio de estado incorrecto', async () => {
        prisma.shipment.findUnique.mockResolvedValue({
            id: '1',
            estado: 'CREATED',
        });

        await expect(
            service.actualizarEstado(
                '1',
                {
                    estado: 'DELIVERED',
                    ubicacion: 'Madrid',
                },
                1
            )
        ).rejects.toThrow(BadRequestException);
    });

    it('actualiza un envío a entregado', async () => {
        prisma.shipment.findUnique.mockResolvedValue({
            id: '1',
            estado: 'OUT_FOR_DELIVERY',
        });

        prisma.shipment.update.mockResolvedValue({});
        prisma.shipmentEvent.create.mockResolvedValue({});

        await service.actualizarEstado(
            '1',
            {
                estado: 'DELIVERED',
                ubicacion: 'Madrid',
            },
            1
        );

        expect(prisma.shipment.update).toHaveBeenCalled();
        expect(prisma.shipmentEvent.create).toHaveBeenCalled();
    });

    it('asigna los envíos usando FFD', async () => {
        prisma.shipment.findMany.mockResolvedValue([
            { id: '1', peso: 6, estado: 'IN_WAREHOUSE' },
            { id: '2', peso: 4, estado: 'IN_WAREHOUSE' },
            { id: '3', peso: 3, estado: 'IN_WAREHOUSE' },
        ]);

        const resultado = await service.asignarVehiculos({
            shipmentIds: ['1', '2', '3'],
            vehicleCapacity: 10,
        });

        expect(resultado.totalVehiclesUsed).toBe(2);
        expect(resultado.vehicles[0].totalWeight).toBe(10);
    });
});