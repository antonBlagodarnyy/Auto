import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from './client.model';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientService } from './clients.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-clients',
  imports: [
    ClientFormComponent,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
  ],
  template: ` <app-client-form
      (createdOrUpdated)="updateClients()"
    ></app-client-form>

    <table mat-table [dataSource]="clients.getValue()">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let client">{{ client.name }}</td>
      </ng-container>

      <ng-container matColumnDef="phone">
        <th mat-header-cell *matHeaderCellDef>Phone</th>
        <td mat-cell *matCellDef="let client">{{ client.phone }}</td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let client">{{ client.email }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let client">
          <button mat-button (click)="onClientDelete(client.id)">Delete</button>
          <button
            mat-button
            (click)="
              toggleForm(client.name, client.phone, client.email, client.id)
            "
          >
            Edit
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
      <tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
    </table>`,
})
export class ClientsComponent implements OnInit {
  clients = new BehaviorSubject<Client[]>([]);

  columnsToDisplay = ['name', 'phone', 'email', 'actions'];

  editForm = inject(MatDialog);

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.updateClients();
  }
  updateClients() {
    this.clientService.getClients()?.subscribe((client) => {
      this.clients.next(client.results);
    });
  }

  onClientDelete(clientId: number) {
    this.clientService
      .deleteClient(clientId)
      ?.subscribe(() => this.updateClients());
  }
  toggleForm(
    clientName: string,
    clientPhone: string,
    clientEmail: string,
    clientId: number
  ) {
    const dialogRef = this.editForm.open(ClientFormComponent, {
      data: {
        edit: true,
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
        id: clientId,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.updateClients();
    });
  }
}
