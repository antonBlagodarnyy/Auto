import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ITask } from '../Interfaces/ITask';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createTask$(content: string) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      const taskData = { userId: userId, content: content };
      return this.http.post<{ taskId: number }>(
        environment.apiUrl + '/task/create',
        taskData
      );
    } else {
      return EMPTY;
    }
  }

  getTasks$() {
    const userId = this.authService.user.getValue()?.userId;
    if (userId != null || userId != undefined) {
      return this.http.get<{
        results: ITask[];
      }>(environment.apiUrl + '/task/get');
    } else return EMPTY;
  }

  deleteTask(taskId: number) {
    return this.http.delete(environment.apiUrl + '/task/delete', {
      body: { taskId: taskId },
      responseType: 'text',
    });
  }

  checkTask$(taskId: number) {
    return this.http.put(
      environment.apiUrl + '/task/check',
      { taskId: taskId },
      { responseType: 'text' }
    );
  }
}
