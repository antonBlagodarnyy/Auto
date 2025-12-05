import { Component, OnInit } from '@angular/core';
import { ITask } from '../../Interfaces/ITask';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-todo',
  imports: [
    FormsModule,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    MatListModule,
  ],
  template: `
    <div class="container">
      <form>
        <mat-form-field>
          <mat-label>Tasks</mat-label>
          <input
            matInput
            [(ngModel)]="taskContent"
            name="taskContent"
            type="text"
          />
          <button mat-button (click)="addTask()">Añadir tarea</button>
        </mat-form-field>
      </form>
      <mat-list>
        @for (task of tasks.getValue(); track task.taskId) {
        <mat-list-item>
          <span [class.checked]="task.checked">
            {{ task.content }}
          </span>
          <span style="flex:1 1 auto"></span>
          <button mat-stroked-button (click)="toggleTask(task.taskId)">
            {{ task.checked ? 'Uncheck' : 'Check' }}</button
          ><button mat-raised-button (click)="deleteTask(task.taskId)">
            Eliminar tarea
          </button>
        </mat-list-item>
        }
      </mat-list>
    </div>
  `,
  styles: `.checked{
    text-decoration: line-through;
  }
  .container{
    padding:2vh;
    background-color: var(--mat-sys-background);
  }`,
})
export class TodoComponent implements OnInit {
  tasks = new BehaviorSubject<ITask[]>([]);
  taskContent: string | undefined;

  constructor(private todoService: TodoService) {}
  ngOnInit(): void {
    this.updateTasks();
  }

  updateTasks() {
    this.todoService.getTasks$()?.subscribe((tasks) => {
      this.tasks.next(tasks.results);
    });
  }
  addTask() {
    if (this.taskContent) {
      const content = this.taskContent;
      this.todoService.createTask$(content).subscribe({
        next: (res) => {
          const currentTasks = this.tasks.getValue();
          const updateTasks = [
            ...currentTasks,
            { content: content, taskId: res.taskId, checked: false },
          ];
          this.tasks.next(updateTasks);
        },
      });
    }
  }

  toggleTask(taskId: number) {
    this.todoService.checkTask$(taskId).subscribe({
      next: () => {
        this.updateTasks();
      },
    });
  }

  deleteTask(taskId: number) {
    this.todoService.deleteTask(taskId).subscribe(() => this.updateTasks());
  }
}
