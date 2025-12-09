import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ITask } from '../Interfaces/ITask';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}
  private tasksSubject = new BehaviorSubject<ITask[]>([]);
  readonly tasks$ = this.tasksSubject.asObservable();

  addTask$(content: string) {
    return this.http
      .post<{ taskId: number }>(environment.apiUrl + '/task/create', {
        content: content,
      })
      .pipe(
        tap((res) => {
          const current = this.tasksSubject.value;
          this.tasksSubject.next([
            ...current,
            { taskId: res.taskId, content: content, checked: false },
          ]);
        })
      );
  }

  getTasks$() {
    return this.http
      .get<{
        results: ITask[];
      }>(environment.apiUrl + '/task/get')
      .pipe(
        tap((res) => {
          this.tasksSubject.next(res.results);
        })
      );
  }

  deleteTask$(taskId: number) {
    return this.http
      .delete(environment.apiUrl + '/task/delete', {
        body: { taskId: taskId },
        responseType: 'text',
      })
      .pipe(
        tap(() => {
          this.tasksSubject.next(
            this.tasksSubject.value.filter((t) => t.taskId !== taskId)
          );
        })
      );
  }

  checkTask$(taskId: number) {
    return this.http
      .put(
        environment.apiUrl + '/task/check',
        { taskId: taskId },
        { responseType: 'text' }
      )
      .pipe(
        tap(() => {
          this.tasksSubject.next(
            this.tasksSubject.value.map((t) =>
              t.taskId == taskId ? { ...t, checked: !t.checked } : t
            )
          );
        })
      );
  }
}
