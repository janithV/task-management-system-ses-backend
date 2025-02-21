/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Task, TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  //create a task for the token bearer
  async create(createTaskDto: CreateTaskDto, user: any) {
    try {
      createTaskDto.status = 1;
      createTaskDto.user = user.sub;

      const createTask = new this.taskModel(createTaskDto);

      return await createTask.save()
    } catch (error) {
      throw new Error(error.message ?? "Task save failed")
    }
  }

  // find all the tasks associated with the token bearer
  async findAll(user: any, filter?: number) {
   try {

    const query: any = { user: user.sub };

    if (filter && [1, 2, 3].includes(filter)) {    
      query.status = filter; // Filter by status
    }

    const sortOptions = filter === 4 ? { dueDate: 1 as mongoose.SortOrder } : {};

    const records = await this.taskModel.find(query).sort(sortOptions).exec()

    return records
    
   } catch (error) {
    throw new Error(error.message ?? "Task retrieval failed")
   }
  }

  // find a task associated with the token bearer
  async findOne(id: string, user: any) {
    try {
      const task = await this.taskModel.findOne({
        user: user.sub,
        _id: id
      }).exec()

      if(!task) {
        throw new NotFoundException('Requested task not found')
      }
      
      return task

    } catch (error) {
      throw new Error(error.message ?? "Task not found")
    }
  }

  // update any task by id whic is associated with the token bearer
  async update(id: string, user: any, updateTaskDto: UpdateTaskDto) {
   try {

    const task = await this.taskModel.findOne({
      user: user.sub,
      _id: id
    }).exec()

    if(!task) {
      throw new NotFoundException('Requested task not found')
    }

    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto)

    return updatedTask

   } catch (error) {
    throw new Error(error.message ?? "Task update failed")
   }
  }

   // delete any task by id whic is associated with the token bearer
  async remove(id: string, user: any) {
   try {

    const task = await this.taskModel.findOne({
      user: user.sub,
      _id: id
    }).exec()

    if(!task) {
      throw new NotFoundException('Requested task not found')
    }

    const deletedTask = await this.taskModel.findByIdAndDelete(id)

    return deletedTask

   } catch (error) {
    throw new Error(error.message ?? "Task deletion failed")
   }
  }

  // generate analytics for the token bearer using an aggregation pipe
  async generateAnalytics(user: any) {
    try {

      const pipeline = [
        {
          $match: { user: new mongoose.Types.ObjectId(user.sub) } 
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$_id", 1] }, "$count", 0]
              }
            },
            completed: {
              $sum: {
                $cond: [{ $eq: ["$_id", 3] }, "$count", 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            total: 1,
            pending: 1,
            completed: 1
          }
        }
      ];
      
      const result = await this.taskModel.aggregate(pipeline);
      return result.length ? result[0] : { total: 0, pending: 0, completed: 0 };
      
    } catch (error) {
      throw new Error(error.message ?? "Task analytics not found")
    }
  }
}
