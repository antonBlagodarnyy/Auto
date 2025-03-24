import { Component, input, InputSignal, output } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'app-task',
  imports: [],
  template: ` <li>
    {{ task()?.content }}
    <span
      ><input
        type="checkbox"
        [checked]="task()?.checked"
        (change)="toggleTask(task()?.taskId)" /></span
    ><button (click)="deleteTask(task()?.taskId)">Eliminar tarea</button>
  </li>`,
  styleUrl: './task.component.css',
})
export class TaskComponent {
  task = input<Task>();
  taskTogglesId = output<number>();
  taskDeleteId = output<number>();

  toggleTask(taskId: number | undefined) {
    if (taskId != undefined) {
      this.taskTogglesId.emit(taskId);
    }
  }

  deleteTask(taskId: number | undefined) {
    if (taskId != undefined) {
      this.taskDeleteId.emit(taskId);
    }
  }
}
