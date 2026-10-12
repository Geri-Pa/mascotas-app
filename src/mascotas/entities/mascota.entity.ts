import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mascota {
    @PrimaryGeneratedColumn()
    id: number
    @Column({type:"varchar"})
    nombre:string
    @Column({type:"varchar"})
    animal:string
    @Column({type:"varchar"})
    raza:string
    @Column()
    edad:number
    @Column()
    id_dueño:number

}
