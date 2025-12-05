import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Client } from '../dashboard/clients/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getClients() {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      return this.http.get<{
        results: Client[];
      }>(environment.apiUrl + '/client/get', { params: { userId: userId } });
    } else return null;
  }

  createClient(name: string, phone: number, email: string) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      const clientData = {
        userId: userId,
        name: name,
        phone: phone,
        email: email,
      };
      return this.http.post<{
        client: {
          clientId: number;
          name: string;
          phone: number;
          email: string;
        };
      }>(environment.apiUrl + '/client/create', clientData);
    } else {
      return null;
    }
  }

  deleteClient(id: number) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      return this.http.delete<{ message: string }>(
        environment.apiUrl + '/client/delete',
        { params: { productId: id } }
      );
    } else {
      return null;
    }
  }

  updateClient(id: number, name: string, phone: number, email: string) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      const clientData = {
        clientId: id,
        name: name,
        phone: phone,
        email: email,
      };
      return this.http.put<{
        client: {
          clientId: number;
          name: string;
          phone: number;
          email: string;
        };
      }>(environment.apiUrl + '/client/update', clientData);
    } else {
      return null;
    }
  }
}
