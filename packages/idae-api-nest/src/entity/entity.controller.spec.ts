import { Test, TestingModule } from '@nestjs/testing';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { DatabaseService } from '../database/database.service';

// Mock DatabaseService (used by EntityService)
class MockDatabaseService {
  getConnection() {
    return {
      model: () => ({
        findById: () => ({ lean: () => ({ exec: async () => ({}) }) }),
        find: () => ({ lean: () => ({ exec: async () => [] }) }),
      }),
    };
  }
}

describe('EntityController', () => {
  let controller: EntityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityController],
      providers: [
        EntityService,
        { provide: DatabaseService, useClass: MockDatabaseService },
      ],
    }).compile();

    controller = module.get<EntityController>(EntityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getId', () => {
    it('should call entityService.getById with numeric id', async () => {
      const spy = jest
        .spyOn(controller['entityService'], 'getById')
        .mockResolvedValue({ id: 42 } as unknown as Promise<any>);
      const result = await controller.getId('base', 'entity', '42');
      expect(spy).toHaveBeenCalledWith('base', 'entity', 42);
      expect(result).toEqual({ id: 42 });
    });

    it('should return error for non-numeric id', async () => {
      const result = await controller.getId('base', 'entity', 'abc');
      expect(result).toEqual({ error: 'Not a valid numeric id', value: 'abc' });
    });
  });

  describe('getCommand', () => {
    it('should call entityService.executeCommand', async () => {
      const spy = jest
        .spyOn(controller['entityService'], 'executeCommand')
        .mockResolvedValue(['ok'] as unknown as Promise<any>);
      const result = await controller.getCommand('base', 'entity', 'list', {
        foo: 'bar',
      });
      expect(spy).toHaveBeenCalledWith('base', 'entity', 'list', {
        foo: 'bar',
      });
      expect(result).toEqual(['ok']);
    });
  });
});
