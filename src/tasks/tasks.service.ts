import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  // **********
  // すべてのタスクを取得する処理
  // **********

  getAllTasks(): Task[] {
    return this.tasks;
  }

  // **********
  // タスクをフィルター
  // **********

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }

        return false;
      });
    }

    return tasks;
  }

  // **********
  // 特定のtaskを取得する処理。
  // **********

  getTaskId(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task width ID "${id}" not found`);
    }
    return found;
  }

  // **********
  // 新規のタスクを生成する処理
  // **********

  createTask(createTaskDto: CreateTaskDto): Task {
    // NOTE: ランダムな文字列を生成する処理
    const l = 8;
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const cl = c.length;
    let taskId = '';
    for (let i = 0; i < l; i++) {
      taskId += c[Math.floor(Math.random() * cl)];
    }

    // NOTE: 生成する処理
    const { title, description } = createTaskDto;
    const task: Task = {
      id: taskId,
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  // **********
  // 特定のタスクを更新する処理
  // **********

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskId(id);
    task.status = status;
    return task;
  }

  // **********
  // 特定のタスクを削除する処理
  // **********

  deleteTask(id: string): void {
    const found = this.getTaskId(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
