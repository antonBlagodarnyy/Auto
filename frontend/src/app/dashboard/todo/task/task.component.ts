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
        (change)="toggleTask(task()?.id)"
    /></span>
  </li>`,
  styleUrl: './task.component.css',
})
export class TaskComponent {
  task = input<Task>();
  taskTogglesId = output<number>();

  toggleTask(taskId: number | undefined) {
    if (taskId != undefined) {
      this.taskTogglesId.emit(taskId);
    }
  }
}
