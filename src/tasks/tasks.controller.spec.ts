import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BadRequestException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(User.name),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            generateAnalytics: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: '',
        dueDate: 0,
        status: 0,
        user: ''
      };
      const user = 'testUser';
      const result = { _id: '1', ...createTaskDto } as any;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(user, createTaskDto)).toEqual({
        statusCode: 201,
        message: 'Task created successfully',
        data: result,
      });
    });

    it('should throw BadRequestException on error', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: '',
        dueDate: 0,
        status: 0,
        user: ''
      };
      const user = 'testUser';

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Task creation failed'));

      await expect(controller.create(user, createTaskDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all tasks successfully', async () => {
      const user = 'testUser';
      const filter = 1;
      const result = [{ _id: '1', title: 'Test Task' }] as any;

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(user, filter)).toEqual({
        statusCode: 200,
        message: 'Tasks found successfully',
        data: result,
      });
    });

    it('should throw BadRequestException on error', async () => {
      const user = 'testUser';
      const filter = 1;

      jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Tasks retrieval failed'));

      await expect(controller.findAll(user, filter)).rejects.toThrow(BadRequestException);
    });
  });

  describe('taskAnalytics', () => {
    it('should generate task analytics successfully', async () => {
      const user = 'testUser';
      const result = { totalTasks: 10 };

      jest.spyOn(service, 'generateAnalytics').mockResolvedValue(result);

      expect(await controller.taskAnlaytics(user)).toEqual({
        statusCode: 200,
        message: 'Task analytics generated successfully',
        data: result,
      });
    });

    it('should throw BadRequestException on error', async () => {
      const user = 'testUser';

      jest.spyOn(service, 'generateAnalytics').mockRejectedValue(new Error('Task analytics not found'));

      await expect(controller.taskAnlaytics(user)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a task successfully', async () => {
      const user = 'testUser';
      const id = '1';
      const result = { _id: '1', title: 'Test Task', __v: 0 } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(user, id)).toEqual({
        statusCode: 200,
        message: 'Task found successfully',
        data: result,
      });
    });

    it('should throw BadRequestException on error', async () => {
      const user = 'testUser';
      const id = '1';

      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Task retrieval failed'));

      await expect(controller.findOne(user, id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const user = 'testUser';
      const id = '1';
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const result = { _id: '1', __v: 0, ...updateTaskDto } as any;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(user, id, updateTaskDto)).toEqual({
        statusCode: 200,
        message: 'Task updated successfully',
        data: result,
      });
    });

    it('should throw BadRequestException on error', async () => {
      const user = 'testUser';
      const id = '1';
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Task update failed'));

      await expect(controller.update(user, id, updateTaskDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const user = 'testUser';
      const id = '1';
      const result = { _id: '1', title: 'Test Task', __v: 0, $assertPopulated: jest.fn(), $clearModifiedPaths: jest.fn(), $clone: jest.fn(), $createModifiedPathsSnapshot: jest.fn() } as any;

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(user, id)).toEqual({
        statusCode: 200,
        message: 'Task deleted successfully',
        data: result,
      });
    });

    it('should throw BadRequestException on error', async () => {
      const user = 'testUser';
      const id = '1';

      jest.spyOn(service, 'remove').mockRejectedValue(new Error('Task deletion failed'));

      await expect(controller.remove(user, id)).rejects.toThrow(BadRequestException);
    });
  });
});
