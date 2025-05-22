import { Component, input, InputSignal, output } from '@angular/core';
import { Task } from './task.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-task',
  imports: [MatButtonModule, MatCheckboxModule],
  template: `<div style="display:flex">
    <span [class.checked]="task()?.checked">
      {{ task()?.content }}
    </span>
    <span style="flex:1 1 auto"></span>
    <button mat-stroked-button (click)="toggleTask(task()?.taskId)">
      Check</button
    ><button mat-raised-button (click)="deleteTask(task()?.taskId)">
      Eliminar tarea
    </button>
  </div> `,
  styles: `.checked{
    color:grey;
    text-decoration:line-through;
  }`,
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
