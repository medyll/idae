import { Controller, Get, Param, Query } from '@nestjs/common';
import { EntityService } from './entity.service';

@Controller('api/:base/:entity')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Get('do/:command')
  getCommand(
    @Param('base') base: string,
    @Param('entity') entity: string,
    @Param('command') command: string,
    @Query() query: any,
  ) {
    return this.entityService.executeCommand(base, entity, command, query);
  }

  @Get(':id')
  getId(
    @Param('base') base: string,
    @Param('entity') entity: string,
    @Param('id') id: string,
  ) {
    if (/^\d+$/.test(id)) {
      return this.entityService.getById(base, entity, id);
    }
    return { error: 'Not a valid numeric id', value: id };
  }
}
