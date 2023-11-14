import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       return task.title.includes(search) || task.description.includes(search);
  //     });
  //   }

  //   return tasks;
  // }

  async getTasksById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return found;
  }

  // getTaskById(id: string): Task {
  //   // get task, if no task return 404, otherwise
  //   const foundTask = this.tasks.find((task) => task.id === id);

  //   if (!foundTask) {
  //     throw new NotFoundException(`Task with id ${id} is not found.`);
  //   }

  //   return foundTask;
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  // deleteTask(id: string): Task {
  //   const taskToDelete = this.tasks.find((task) => task.id === id);
  //   const indexToDelete = this.tasks.indexOf(taskToDelete);
  //   const deletedTask = this.tasks.splice(indexToDelete, 1)[0]; // splice returns a array. Only want the actual task in the array.
  //   return deletedTask;
  // }

  // updateTaskStatus(id: string, updateTaskStatus: TaskStatus): Task {
  //   const taskToUpdate = this.getTaskById(id);
  //   taskToUpdate.status = updateTaskStatus;
  //   return taskToUpdate;
  // }
}
