import { Module } from '@nestjs/common';
import { MascotasService } from './mascotas.service';
import { MascotasController } from './mascotas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascota } from './entities/mascota.entity';
import { HttpModule } from '@nestjs/axios';
import { url } from 'inspector';

@Module({
  imports:[TypeOrmModule.forFeature([Mascota]),
HttpModule.register({
  baseURL: "http://localhost:3002"
  })],  
  controllers: [MascotasController],
  providers: [MascotasService],
})
export class MascotasModule {}
