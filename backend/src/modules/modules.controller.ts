import { Controller, Get, Post, Body, Param, Put, Delete, Request } from '@nestjs/common';
import { ModuleService } from './modules.service';
import { ModuleDto } from 'src/dto/modules.dto';  
import { Modules } from 'src/models/modules.schema'; 

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  // Create a new module
  @Post()
  async create(@Body() moduleData: ModuleDto): Promise<Modules> {
    return this.moduleService.create(moduleData);
  }

  // Get all modules
  @Get()
  async findAll(): Promise<Modules[]> {
    return this.moduleService.findAll();
  }

  // Get a single module by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Modules> {
    return this.moduleService.findOne(id);
  }

  // Update a module by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() moduleData: ModuleDto,  
  ): Promise<Modules> {
    return this.moduleService.update(id, moduleData);
  }

  // Delete a module by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.moduleService.remove(id);
  }

<<<<<<< HEAD
  // Get modules for a specific user by user_id 
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Module[]> {
=======
  // Get modules for a specific user by user_id
  @Get('user/:user_id')
  async findByUser(@Param('user_id') userId: string): Promise<Modules[]> {
>>>>>>> 15d1508ba2aa19480b3eb8deaae86ddf598ea17b
    return this.moduleService.findByUserId(userId);
  }

  // Get modules for the currently authenticated user 
  @Get('me')
  async findMyModules(@Request() req): Promise<Modules[]> {
    const userId = req.user.user_id;  
    return this.moduleService.findMyModules(userId);
  }
  @Get('user')
  async findModulesByUserQuery(@Request() req): Promise<Module[]> {
    const userId = req.query.userId; 
    if (!userId) {
      throw new Error("userId query parameter is required.");
    }
    return this.moduleService.findByUserId(userId);
  }
}

