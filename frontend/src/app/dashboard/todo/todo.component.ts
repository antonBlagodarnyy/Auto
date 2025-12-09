import { Component, inject, OnInit, Signal } from '@angular/core';
import { ITask } from '../../Interfaces/ITask';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
  ],
  template: `
    <div class="container">
      <form matDialogTitle (ngSubmit)="addTask()">
        <mat-form-field appearance="outline" hintLabel="Max 20 characters">
          <mat-label>Tasks</mat-label>
          <input
            matInput
            [(ngModel)]="taskContent"
            name="taskContent"
            type="text"
            maxlength="20"
          />
        </mat-form-field>
        <button class="button-submit" mat-button type="submit">Add task</button>
      </form>
      <mat-dialog-content>
        @for (task of tasks(); track task.taskId) {
        <div class="container-task">
          <mat-checkbox
            [checked]="task.checked"
            (change)="toggleTask(task.taskId)"
          >
            {{ task.content }}
          </mat-checkbox>

          <button mat-mini-fab (click)="deleteTask(task.taskId)">
            <mat-icon fontIcon="delete" />
          </button>
        </div>
        @if($index+1 != tasks.length){
        <mat-divider></mat-divider>
        } }
      </mat-dialog-content>
    </div>
  `,
  styles: `
  .container{
    padding:2vh;
    
  }
  .container-task{
    padding:2vh;
   display:flex;
   justify-content:space-between;
  }
  `,
})
export class TodoComponent implements OnInit {
  constructor() {}
  private todoService = inject(TodoService);
  tasks: Signal<ITask[]> = toSignal(this.todoService.tasks$, {
    initialValue: [],
  });

  taskContent: string | undefined;

  ngOnInit(): void {
    this.todoService.getTasks$().subscribe();
  }

  addTask() {
    if (this.taskContent)
      this.todoService.addTask$(this.taskContent).subscribe();
  }

  toggleTask(taskId: number) {
    this.todoService.checkTask$(taskId).subscribe();
  }

  deleteTask(taskId: number) {
    this.todoService.deleteTask$(taskId).subscribe();
  }
}
