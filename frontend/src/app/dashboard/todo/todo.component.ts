import { Component, OnInit } from '@angular/core';
import { Task } from './task/task.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './task/task.component';
import { TodoService } from './todo.service';
import { BehaviorSubject } from 'rxjs';

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
      @for (task of tasks.getValue(); track task) {
      <app-task
        [task]="task"
        (taskTogglesId)="onTaskToggled($event)"
        (taskDeleteId)="onTaskDelete($event)"
      ></app-task>
      }
    </ul> `,
})
export class TodoComponent implements OnInit {
  tasks = new BehaviorSubject<Task[]>([]);
  form = new FormGroup({ taskContent: new FormControl('') });

  constructor(private todoService: TodoService) {}
  ngOnInit(): void {
    this.updateTasks();
  }

  updateTasks() {
    let tasksArr: Task[] = [];
    this.todoService.getTasks()?.subscribe((tasks) => {
      tasks.results.map((taskRaw) => {
        tasksArr.push({
          taskId: taskRaw.ID,
          userId: taskRaw.USER_ID,
          content: taskRaw.CONTENT,
          checked: taskRaw.CHECKED,
        });
      });
    });
    this.tasks.next(tasksArr);
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
    this.tasks = this.tasks.map<Task>((taskFiltered) => {
      if (taskFiltered.taskId == taskId) {
        taskFiltered.checked = !taskFiltered.checked;
      }
      return taskFiltered;
    });
  }

  onTaskDelete(taskId: number) {
    console.log('ontaskdelete');
    this.todoService.deleteTask(taskId).subscribe();
    this.updateTasks();
  }
}
