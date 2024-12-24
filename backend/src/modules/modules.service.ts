import {
    Injectable,
    NotFoundException,
    ConflictException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Modules } from 'src/models/modules.schema';
  import { ModuleDto } from 'src/dto/modules.dto';  
  import { UpdateModuleDto } from 'src/dto/UpdateModule.dto';  
  import { JwtService } from '@nestjs/jwt'; 
  
  @Injectable()
  export class ModuleService {
    constructor(
      @InjectModel(Modules.name) private moduleModel: Model<Modules>,
      private jwtService: JwtService,
    ) {}
  
    // Create a new module
    async create(createModuleDto: ModuleDto): Promise<Modules> {
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
    async findAll(): Promise<Modules[]> {
      return this.moduleModel.find().exec();  
    }
  
    // Get a single module by ID
    async findOne(module_id: string): Promise<Modules> {
      const module = await this.moduleModel.findOne({module_id}).exec();
      if (!module) {
        throw new NotFoundException('Module not found');
      }
      return module;  
    }
  
    // Get modules by user_id
    async findByUserId(userId: string): Promise<Modules[]> {
      return this.moduleModel.find({ user_id: userId }).exec();
    }
  
    // Get modules for the current authenticated user
    async findMyModules(userId: string): Promise<Modules[]> {
      return this.moduleModel.find({ user_id: userId }).exec();
    }
  
    // Update an existing module by ID
    async update(module_id: string, updateModuleDto: UpdateModuleDto): Promise<Modules> {
      const existingModule = await this.moduleModel.findOne({module_id}).exec();
      if (!existingModule) {
        throw new NotFoundException('Module not found');
      }
  

      const updatedModule = await this.moduleModel
        .findOneAndUpdate({module_id}, updateModuleDto, { new: true })
        .exec();
  
      return updatedModule; 
    }
  
    // Delete a module by ID
    async remove(module_id: string): Promise<Modules> {
      const module = await this.moduleModel.findOneAndDelete({module_id}).exec();
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

    async findByCourseId(courseId: string): Promise<Modules[]> {
      return this.moduleModel.find({ course_id: courseId }).exec();
    }

  }
  
