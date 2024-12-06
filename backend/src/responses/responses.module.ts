import { Module } from '@nestjs/common';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { response } from 'express';
import { responses } from 'src/models/responses.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: responses.name, schema: responses.schema}])
  ], 
  controllers: [ResponsesController],
  providers: [ResponsesService]
})
export class ResponsesModule {}  
