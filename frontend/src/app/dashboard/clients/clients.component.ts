import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from './client.model';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientsService } from './clients.service';
import { NgFor, TitleCasePipe } from '@angular/common';
import { ClientComponent } from './client/client.component';

@Component({
  selector: 'app-clients',
  imports: [ClientFormComponent, TitleCasePipe, NgFor, ClientComponent],
  template: ` <app-client-form
      [mode]="'create'"
      (createdOrUpdated)="updateClients()"
    ></app-client-form>
    <table>
      <thead>
        <tr>
          <td *ngFor="let k of objectKeys(clients.getValue()[0] || {})">
            {{ k | titlecase }}
          </td>
        </tr>
      </thead>
      <tbody>
        @for (client of clients.getValue(); track client.id) {
        <app-client
          [client]="client"
          (clientDeleteId)="onClientDelete($event)"
          (updated)="updateClients()"
        />
        }
      </tbody>
    </table>`,
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit{
  clients = new BehaviorSubject<Client[]>([]);

  constructor(private clientService: ClientsService) {}

  ngOnInit(): void {
    this.updateClients();
  }
  updateClients() {
    this.clientService.getClients()?.subscribe((client) => {
      this.clients.next(client.results);
    });
  }
  objectKeys(obj: Client) {
    let keys = Object.keys(obj);
    keys = keys.filter((key) => key != 'id');
    return keys;
  }
  onClientDelete(clientId: number) {
    this.clientService
      .deleteClient(clientId)
      ?.subscribe(() => this.updateClients());
  }
}
