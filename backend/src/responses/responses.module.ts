import { Module } from '@nestjs/common';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { response } from 'express';
import { responses, ResponsesSchema } from 'src/models/responses.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: responses.name, schema: ResponsesSchema}])
  ], 
  controllers: [ResponsesController],
  providers: [ResponsesService]
})
export class ResponsesModule {}  
