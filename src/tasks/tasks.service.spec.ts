import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: Model<TaskDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskModel = module.get<Model<TaskDocument>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('TasksService', () => {
  let service: TasksService;
  let model: Model<TaskDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<Model<TaskDocument>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks for the user', async () => {
      const user = { sub: 'userId' };
      const tasks = [{ title: 'Test Task', user: 'userId' }];
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(tasks),
        }),
      } as any);

      const result = await service.findAll(user);

      expect(result).toEqual(tasks);
      expect(model.find).toHaveBeenCalledWith({ user: user.sub });
    });

    it('should filter tasks by status', async () => {
      const user = { sub: 'userId' };
      const filter = 1;
      const tasks = [{ title: 'Test Task', user: 'userId', status: 1 }];
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(tasks),
        }),
      } as any);

      const result = await service.findAll(user, filter);

      expect(result).toEqual(tasks);
      expect(model.find).toHaveBeenCalledWith({ user: user.sub, status: filter });
    });

    it('should sort tasks by due date when filter is 4', async () => {
      const user = { sub: 'userId' };
      const filter = 4;
      const tasks = [{ title: 'Test Task', user: 'userId', dueDate: 1 }];
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(tasks),
        }),
      } as any);

      const result = await service.findAll(user, filter);

      expect(result).toEqual(tasks);
      expect(model.find).toHaveBeenCalledWith({ user: user.sub });
      expect(model.find().sort).toHaveBeenCalledWith({ dueDate: 1 });
    });

    it('should throw an error if task retrieval fails', async () => {
      const user = { sub: 'userId' };
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Task retrieval failed')),
        }),
      } as any);

      await expect(service.findAll(user)).rejects.toThrow('Task retrieval failed');
    });
  });
});
