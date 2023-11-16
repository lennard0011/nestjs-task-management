import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
//import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTasksById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ id });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    const deleteResponse = await this.tasksRepository.delete(id);
    if (deleteResponse.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatus: TaskStatus,
  ): Promise<Task> {
    const taskToUpdate = await this.getTasksById(id);
    taskToUpdate.status = updateTaskStatus;
    this.tasksRepository.save(taskToUpdate);
    return taskToUpdate;
  }
}
