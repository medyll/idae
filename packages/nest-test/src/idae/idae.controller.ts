// This file defines the controller for the 'idae' resource, handling HTTP requests and responses.
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdaeService } from './idae.service';
import { CreateIdaeDto } from './dto/create-idae.dto';
import { UpdateIdaeDto } from './dto/update-idae.dto';
import { CreateIdaeValidationPipe } from '../create-idae-validation.pipe';

// Decorator: Marks this class as a NestJS controller for the 'idae' resource.
@Controller('idae')
export class IdaeController {
  constructor(private readonly idaeService: IdaeService) {}

  @Post()
  create(@Body(new CreateIdaeValidationPipe()) createIdaeDto: CreateIdaeDto) {
    return this.idaeService.create(createIdaeDto);
  }

  @Get()
  findAll() {
    return this.idaeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.idaeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdaeDto: UpdateIdaeDto) {
    return this.idaeService.update(+id, updateIdaeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.idaeService.remove(+id);
  }
}
