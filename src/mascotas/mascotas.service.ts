import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mascota } from './entities/mascota.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MascotasService {

  constructor(
  @InjectRepository(Mascota)
        private readonly mascotaRepository: Repository<Mascota>,

        private readonly httpService: HttpService
  ){
  }

  
  async create(createMascotaDto: CreateMascotaDto) {
      try {
        const urlDueno = `/clientes/${createMascotaDto.id_dueño}`;
        await firstValueFrom(this.httpService.get(urlDueno));

      } catch (error) {
        throw new NotFoundException("El dueño no existe")
      }
      
      const mascota = this.mascotaRepository.create(createMascotaDto)
      await this.mascotaRepository.save(mascota)
      return{
        'mensaje' : 'mascota creada',
        'mascota' : mascota
      }
  }
  

  async findAll() {

    const mascotas = this.mascotaRepository.find();
    
    try {
      const duenosResponse = await firstValueFrom(this.httpService.get('/clientes'));
      const duenos = duenosResponse.data;
      
      return (await mascotas).map(mascota =>{
        const duenoEncontrado = duenos.find((d: { id: number; }) => d.id === mascota.id_dueño)
      })
    } catch (error) {
       throw new BadRequestException("Error en la busqueda de los ")
    }

  }

  async findOne(id: number) {
    try {
    const mascota = await this.mascotaRepository.findOneBy({id})

      if (!mascota) {
        throw new NotFoundException("la mascota no se ha encontrado")
      }
      const duenosResponse = await firstValueFrom(this.httpService.get(`/clientes/${mascota.id}`));
      const dueno = duenosResponse.data;

      return {
      mascota,
      dueno
      };

    } catch (error) {
      throw new NotFoundException("No se pudo encontrar la mascota o el dueño externo");
    }
  }

  async update(id: number, updateMascotaDto: UpdateMascotaDto) {
    const mascota = await this.mascotaRepository.findOneBy({id});
    
    if (!mascota) {
        throw new NotFoundException("la mascota no se ha encontrado")
    }

    const newMascota = await this.mascotaRepository.update(id, updateMascotaDto);

    return {
      mensaje: 'Mascota actualizada correctamente',
      mascota: newMascota,
    };
    }

  async remove(id: number) {
    const mascota = await this.mascotaRepository.findOneBy({id})
    
    if (!mascota) {
        throw new NotFoundException("Mascota no encontrada")
    }
    
    await this.mascotaRepository.delete(mascota)

    return{
      mensaje : "la mascota fue eliminada con éxito" 
    }
    
  }
}
