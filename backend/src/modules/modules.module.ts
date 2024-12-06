import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './modules.controller';
import { ModuleService } from './modules.service';
import { Module as ModuleSchema } from 'src/models/modules.schema';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
   
    ConfigModule,
    
    
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),

   
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

