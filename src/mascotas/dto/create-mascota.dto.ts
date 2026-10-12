import { IsInt, isString, IsString } from "class-validator";

export class CreateMascotaDto {
    @IsString()
    nombre:string
    @IsString()
    animal:string
    @IsString()
    raza:string
    @IsInt()
    edad:number
    @IsInt()
    id_dueño:number

}
