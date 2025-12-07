import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { IClient } from '../Interfaces/IClient';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private clientsSubject = new BehaviorSubject<IClient[]>([]);

  readonly clients$ = this.clientsSubject.asObservable();

  setClients(clients: IClient[]) {
    this.clientsSubject.next(clients);
  }

  getStoredClients$() {
    return this.http
      .get<{
        results: IClient[];
      }>(environment.apiUrl + '/client/get')
      .pipe(map((res) => this.setClients(res.results)));
  }

  addNewClient$(newClient: { name: string; phone: number; email: string }) {
    return this.http
      .post<{
        clientId: number;
      }>(environment.apiUrl + '/client/create', newClient)
      .pipe(
        map((res) => {
          const current = this.clientsSubject.value;
          this.clientsSubject.next([
            { id: res.clientId, ...newClient },
            ...current,
          ]);
        })
      );
  }

  deleteClient$(clientId: number) {
    return this.http
      .delete(environment.apiUrl + '/client/delete', {
        body: { clientId: clientId },
        responseType: 'text',
      })
      .pipe(
        switchMap(() => this.clientsSubject.pipe(take(1))),
        tap((clients) => {
          this.clientsSubject.next(clients.filter((c) => c.id !== clientId));
        })
      );
  }

  updateClient$(
    clientId: number,
    changedValues: { key: string; value: string }[]
  ) {
    return this.http
      .put(
        environment.apiUrl + '/client/update',
        { clientId: clientId, changedValues: changedValues },
        {
          responseType: 'text',
        }
      )
      .pipe(
        tap(() => {
          // Update local state directly
          const clients = this.clientsSubject.value;
          const updatedClients = clients.map((c) => {
            if (c.id === clientId) {
              return {
                ...c,
                ...Object.fromEntries(
                  changedValues.map((cv) => [
                    cv.key,
                    cv.key === 'phone' ? +cv.value : cv.value,
                  ])
                ),
              };
            }
            return c;
          });
          this.clientsSubject.next(updatedClients);
        })
      );
  }
}
