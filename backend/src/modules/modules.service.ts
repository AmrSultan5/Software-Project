import {
    Injectable,
    NotFoundException,
    ConflictException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Module } from 'src/models/modules.schema';
  import { ModuleDto } from 'src/dto/modules.dto';  
  import { UpdateModuleDto } from 'src/dto/UpdateModule.dto';  
  import { JwtService } from '@nestjs/jwt'; 
  
  @Injectable()
  export class ModuleService {
    constructor(
      @InjectModel(Module.name) private moduleModel: Model<Module>,
      private jwtService: JwtService,
    ) {}
  
    // Create a new module
    async create(createModuleDto: ModuleDto): Promise<Module> {
      const { module_id, course_id, title, content, resources, user_id } = createModuleDto;
  
      // Check if a module with the same module_id already exists
      const existingModule = await this.moduleModel.findOne({ module_id });
      if (existingModule) {
        throw new ConflictException('Module with the same module_id already exists!');
      }
  
      const newModule = new this.moduleModel({
        module_id,
        course_id,
        title,
        content,
        resources,
        user_id,  
      });
  
      // Save and return the new module
      return newModule.save();  
    }
  
    // Get all modules
    async findAll(): Promise<Module[]> {
      return this.moduleModel.find().exec();  
    }
  
    // Get a single module by ID
    async findOne(id: string): Promise<Module> {
      const module = await this.moduleModel.findById(id).exec();
      if (!module) {
        throw new NotFoundException('Module not found');
      }
      return module;  
    }
  
    // Get modules by user_id
    async findByUserId(userId: string): Promise<Module[]> {
      return this.moduleModel.find({ user_id: userId }).exec();
    }
  
    // Get modules for the current authenticated user
    async findMyModules(userId: string): Promise<Module[]> {
      return this.moduleModel.find({ user_id: userId }).exec();
    }
  
    // Update an existing module by ID
    async update(id: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
      const existingModule = await this.moduleModel.findById(id).exec();
      if (!existingModule) {
        throw new NotFoundException('Module not found');
      }
  

      const updatedModule = await this.moduleModel
        .findByIdAndUpdate(id, updateModuleDto, { new: true })
        .exec();
  
      return updatedModule; 
    }
  
    // Delete a module by ID
    async remove(id: string): Promise<Module> {
      const module = await this.moduleModel.findByIdAndDelete(id).exec();
      if (!module) {
        throw new NotFoundException('Module not found');
      }
      return module;  // Return the deleted module
    }
  
    // Validate JWT token
    async validateJwt(jwt: string): Promise<any> {
      try {
        const decoded = this.jwtService.verify(jwt);  
        return decoded;  
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  
