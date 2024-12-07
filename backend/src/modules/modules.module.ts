import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './modules.controller';
import { ModuleService } from './modules.service';
import { Modules , ModuleSchema } from '../models/modules.schema';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
   
    ConfigModule,
    
    
    MongooseModule.forFeature([{ name: Modules.name, schema: ModuleSchema }]),

   
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), 
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES'), 
        },
      }),
    }),
  ],
  controllers: [ModuleController],
  providers: [ModuleService, JwtStrategy], 
  exports: [JwtStrategy], 
})
export class ModuleModule {}

