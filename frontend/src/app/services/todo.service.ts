import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ITask } from '../Interfaces/ITask';


@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}

  createTask$(content: string) {
      return this.http.post<{ taskId: number }>(
        environment.apiUrl + '/task/create',
        {content: content }
      );
   
  }

  getTasks$() {
    
      return this.http.get<{
        results: ITask[];
      }>(environment.apiUrl + '/task/get');
    
  }

  deleteTask$(taskId: number) {
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
