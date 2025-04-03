import { Component, input, output } from '@angular/core';
import { ClientFormComponent } from "../client-form/client-form.component";
import { Client } from '../client.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-client',
  imports: [ClientFormComponent,NgIf],
  template: `<tr *ngIf="!showForm">
  <td>{{ client()?.name }}</td>
  <td>{{ client()?.phone }}</td>
  <td>{{ client()?.email }}</td>
  <td>
    <button (click)="toggleForm(client()?.id)">Edit</button
    ><button (click)="deleteClient(client()?.id)">Delete</button>
  </td>
</tr>

<tr *ngIf="showForm">
  <td colspan="4">
    <app-client-form
      [mode]="'edit'"
      [client]="client()"
      (createdOrUpdated)="toggleForm(client()?.id); onUpdated()"
    ></app-client-form>
  </td>
  <td>
    <button (click)="toggleForm(client()?.id)">Cancel</button>
  </td>
</tr>`,
  styleUrl: '../clients.component.css'
})
export class ClientComponent {
  client = input<Client>();
  showForm: boolean = false;
  clientDeleteId = output<number>();
  updated = output();

  deleteClient(clientId: number | undefined) {
    if (clientId) {
      if (confirm('Delete client?')) this.clientDeleteId.emit(clientId);
    }
  }
  toggleForm(clientId: number | undefined) {
    if (clientId) {
      this.showForm = !this.showForm;
    }
  }
  onUpdated() {
    this.updated.emit();
  }
}
