import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Auth/Auth.service';
import { Task } from './task/task.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createTask(content: string, checked: boolean) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      const taskData = { userId: userId, content: content, checked: checked };
      return this.http.post<{
        task: Task;
      }>(environment.apiUrl + '/task/create', taskData);
    } else {
      return null;
    }
  }

  getTasks() {
    const userId = this.authService.user.getValue()?.userId;
    if (userId != null || userId != undefined) {
      return this.http.get<{
        results: Task[];
      }>(environment.apiUrl + '/task/get', { params: { userId: userId } });
    } else return null;
  }

  deleteTask(taskId: number) {
    return this.http.delete<{ message: string }>(
      environment.apiUrl + '/task/delete',
      { params: { taskId: taskId } }
    );
  }
  
  checkTask(taskId: number, checked: boolean) {
    return this.http.put<{ message: string }>(
      environment.apiUrl + '/task/check',
      { taskId: taskId, checked: checked }
    );
  }
}
