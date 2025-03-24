import { Component } from '@angular/core';
import { Task } from './task/task.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './task/task.component';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, TaskComponent],
  styleUrl: './todo.component.css',
  template: `<div>Tasks:</div>
    <form [formGroup]="form">
      <input type="text" formControlName="taskContent" />
      <button (click)="addTask()">Añadir tarea</button>
    </form>
    <ul>
      @for (task of tasks; track task) {
      <app-task
        [task]="task"
        (taskTogglesId)="onTaskToggled($event)"
      ></app-task>
      }
    </ul> `,
})
export class TodoComponent {
  tasks: Task[] = [];
  form = new FormGroup({ taskContent: new FormControl('') });

  addTask() {
    if (
      this.form.value.taskContent != null &&
      this.form.value.taskContent != ''
    )
      this.tasks.push({
        id: Math.floor(Math.random() * 100),
        content: this.form.value.taskContent,
        checked: false,
      });
  }

  onTaskToggled(taskId: number) {
    this.tasks = this.tasks.map<Task>((taskFiltered) => {
      if (taskFiltered.id == taskId) {
        taskFiltered.checked = !taskFiltered.checked;
      }
      return taskFiltered;
    });
  }
}
