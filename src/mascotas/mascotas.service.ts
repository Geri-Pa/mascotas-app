import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mascota } from './entities/mascota.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class MascotasService {

  constructor(
  @InjectRepository(Mascota)
        private readonly mascotaRepository: Repository<Mascota>,
        private readonly httpService: HttpService,
  ){
  }

  async create(createMascotaDto: CreateMascotaDto) {
      
      try{
        await firstValueFrom(this.httpService.get(`/clientes/${createMascotaDto.id_dueño}`));
      }
      catch(error: any){
        if(error.response?.status === 404){throw new NotFoundException('Ese dueño no existe wey')}
        throw new ServiceUnavailableException('valió madres el servicio clientes')
      }

      const mascota = this.mascotaRepository.create(createMascotaDto)
      const mascotaGuardada= await this.mascotaRepository.save(mascota)
      return{
        'mensaje' : 'mascota creada',
        'mascota' : mascotaGuardada
      }
  }
  

  async findAll() {

    const mascotas = await this.mascotaRepository.find();

    return {
      "Lista de mascotas" : mascotas
    }
  }

  async findOne(id: number) {
    try {
    const mascota = await this.mascotaRepository.findOneBy({id})

      if (!mascota) {
        throw new NotFoundException("la mascota no se ha encontrado")
      }
      const duenosResponse = await firstValueFrom(this.httpService.get(`/clientes/${mascota.id_dueño}`));
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
