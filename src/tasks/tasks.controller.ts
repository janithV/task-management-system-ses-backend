/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { FailedResponse, SuccessResponse } from 'src/common/types/response-types';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  async create(@GetCurrentUser() user: string, @Body() createTaskDto: CreateTaskDto) {
    try {
      
      const result = await this.tasksService.create(createTaskDto, user);

      const successPayload: SuccessResponse = {
        statusCode: 201,
        message: "Task created successfully",
        data: result
      }

      return successPayload
    } catch (error) {
      
      const errorPayload: FailedResponse = {
        statusCode: 400,
        error: error.message ?? "Task creation failed"
      }

      throw new BadRequestException(errorPayload)
    }

  }

  @Get()
  async findAll(@GetCurrentUser() user: string) {
    try {
      const records = await this.tasksService.findAll(user);

      const successPayload: SuccessResponse = {
        statusCode: 200,
        message: "Tasks found successfully",
        data: records
      }

      return successPayload
    } catch (error) {

      const errorPayload: FailedResponse = {
        statusCode: 400,
        error: error.message ?? "Tasks retrieval failed"
      }

      throw new BadRequestException(errorPayload)
    }
  
  }

  @Get('/analytics')
  async taskAnlaytics(@GetCurrentUser() user: string) {
    try {
      const result = await this.tasksService.generateAnalytics(user);

      const successPayload: SuccessResponse = {
        statusCode: 200,
        message: "Task analytics generated successfully",
        data: result
      }
  
      return successPayload

    } catch (error) {
      const errorPayload: FailedResponse = {
        statusCode: 400,
        error: error.message ?? "Task analytics not found"
      }
  
      throw new BadRequestException(errorPayload)
    }
  }

  @Get(':id')
  async findOne(@GetCurrentUser() user: string, @Param('id') id: string) {
    try {

      const record = await this.tasksService.findOne(id, user);
      
      const successPayload: SuccessResponse = {
        statusCode: 200,
        message: "Task found successfully",
        data: record
      }

      return successPayload
    } catch (error) {
      const errorPayload: FailedResponse = {
        statusCode: 400,
        error: error.message ?? "Task retrieval failed"
      }

      throw new BadRequestException(errorPayload)
    }
  }

  @Patch(':id')
  async update(@GetCurrentUser() user: string, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const result = await this.tasksService.update(id, user, updateTaskDto);

      const successPayload: SuccessResponse = {
        statusCode: 200,
        message: "Task updated successfully",
        data: result
      }

      return successPayload
    } catch (error) {
      const errorPayload: FailedResponse = {
        statusCode: 400,
        error: error.message ?? "Task update failed"
      }

      throw new BadRequestException(errorPayload)
    }

  }

  @Delete(':id')
  async remove(@GetCurrentUser() user: string, @Param('id') id: string) {
   try {
    const result = await this.tasksService.remove(id, user);

    const successPayload: SuccessResponse = {
      statusCode: 200,
      message: "Task deleted successfully",
      data: result
    }

    return successPayload
   } catch (error) {
    const errorPayload: FailedResponse = {
      statusCode: 400,
      error: error.message ?? "Task deletion failed"
    }

    throw new BadRequestException(errorPayload)
   }
  }

}
