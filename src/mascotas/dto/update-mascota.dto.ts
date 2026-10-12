import { PartialType } from '@nestjs/mapped-types';
import { CreateMascotaDto } from './create-mascota.dto';
import { IsString, IsInt } from 'class-validator';

export class UpdateMascotaDto extends PartialType(CreateMascotaDto) {
        
        @IsString()
        nombre:string
        @IsInt()
        edad:number
        
}
