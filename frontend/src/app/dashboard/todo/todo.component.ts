import { Component, OnInit } from '@angular/core';
import { Task } from './task/task.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './task/task.component';
import { TodoService } from './todo.service';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-todo',
  imports: [
    ReactiveFormsModule,
    TaskComponent,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    MatListModule,
  ],
  template: `
    <form [formGroup]="form">
      <mat-form-field>
        <mat-label>Tasks</mat-label>
        <input matInput id="tasks" type="text" formControlName="taskContent" />
        <button mat-button (click)="addTask()">Añadir tarea</button>
      </mat-form-field>
    </form>
    <mat-list>
      @for (task of tasks.getValue(); track task) {
      <mat-list-item>
        <app-task
          [task]="task"
          (taskTogglesId)="onTaskToggled($event)"
          (taskDeleteId)="onTaskDelete($event)"
        ></app-task>
      </mat-list-item>
      }
    </mat-list>
  `,
})
export class TodoComponent implements OnInit {
  tasks = new BehaviorSubject<Task[]>([]);
  form = new FormGroup({ taskContent: new FormControl('') });

  constructor(private todoService: TodoService) {}
  ngOnInit(): void {
    this.updateTasks();
  }

  updateTasks() {
    this.todoService.getTasks()?.subscribe((tasks) => {
      this.tasks.next(tasks.results);
    });
  }
  addTask() {
    if (
      this.form.value.taskContent != null &&
      this.form.value.taskContent != ''
    )
      this.todoService
        .createTask(this.form.value.taskContent, false)
        ?.subscribe((task) => {
          const currentTasks = this.tasks.getValue();
          const updateTasks = [...currentTasks, task.task];
          this.tasks.next(updateTasks);
        });
  }

  onTaskToggled(taskId: number) {
    let tasks = this.tasks.getValue();
    tasks.map((taskFiltered) => {
      if (taskFiltered.taskId == taskId) {
        this.todoService
          .checkTask(taskFiltered.taskId, !taskFiltered.checked)
          .subscribe({
            next: () => {
              this.updateTasks();
            },
          });
      }
    });
  }

  onTaskDelete(taskId: number) {
    console.log('ontaskdelete');
    this.todoService.deleteTask(taskId).subscribe(() => this.updateTasks());
  }
}
