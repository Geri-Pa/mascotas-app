import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MascotasModule } from './mascotas/mascotas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ 
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.DBPORT),
      username: process.env.DBUSER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true
    }),
    MascotasModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
