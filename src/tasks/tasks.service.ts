import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
//import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const deleteResponse = await this.tasksRepository.delete({ id, user });
    if (deleteResponse.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    const taskToUpdate = await this.getTaskById(id, user);
    taskToUpdate.status = updateTaskStatus;
    this.tasksRepository.save(taskToUpdate);
    return taskToUpdate;
  }
}
