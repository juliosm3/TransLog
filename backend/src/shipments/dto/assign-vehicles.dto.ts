import { IsArray, IsNumber, Min } from "class-validator";

export class AssignVehiclesDto {
    @IsArray()
    shipmentIds!: string[];

    @IsNumber()
    @Min(0.01)
    vehicleCapacity!: number;
}