import { Controller, Get, Param } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';

@Controller('tracking')
export class TrackingController {
  constructor(private shipmentsService: ShipmentsService) {}

  @Get(':trackingCode')
  obtenerTracking(@Param('trackingCode') trackingCode: string) {
    return this.shipmentsService.obtenerTracking(trackingCode);
  }
}