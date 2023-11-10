import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    // get task, if no task return 404, otherwise
    const foundTask = this.tasks.find((task) => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} is not found.`);
    }

    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): Task {
    const taskToDelete = this.tasks.find((task) => task.id === id);
    const indexToDelete = this.tasks.indexOf(taskToDelete);
    const deletedTask = this.tasks.splice(indexToDelete, 1)[0]; // splice returns a array. Only want the actual task in the array.
    return deletedTask;
  }

  updateTaskStatus(id: string, newStatus: TaskStatus): Task {
    const taskToUpdate = this.getTaskById(id);
    taskToUpdate.status = newStatus;
    return taskToUpdate;
  }
}
