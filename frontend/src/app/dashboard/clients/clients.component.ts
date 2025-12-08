import { Component, inject, OnInit, Signal } from '@angular/core';
import { IClient } from '../../Interfaces/IClient';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientService } from '../../services/clients.service';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ClientTableComponent } from './client-table/client-table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clients',
  imports: [ClientFormComponent, MatDialogModule, ClientTableComponent],
  template: `
    <app-client-form (createdEvent)="onCreatedClient($event)" />
    <div class="container">
      <app-client-table
        [clients]="clients()"
        (deleteEvent)="onDeleteClient($event)"
        (openEditFormEvent)="onOpenEditForm($event)"
      />
    </div>
  `,
  styles: `.container{
    padding: 5vh;
  }`,
})
export class ClientsComponent implements OnInit {
  constructor(private dialog: MatDialog, private snackBarRef: MatSnackBar) {}

  private clientService = inject(ClientService);

  clients: Signal<IClient[]> = toSignal(this.clientService.clients$, {
    initialValue: [],
  });

  ngOnInit(): void {
    this.clientService.getStoredClients$().subscribe();
  }

  onCreatedClient(newClient: { name: string; phone: number; email: string }) {
    this.clientService.addNewClient$(newClient).subscribe({
      next: () => {
        this.snackBarRef.open('Client added.', '', {
          duration: 1000,
        });
      },
    });
  }

  onDeleteClient(clientId: number) {
    this.clientService.deleteClient$(clientId).subscribe({
      next: () => {
        this.snackBarRef.open('Client deleted.', '', {
          duration: 1000,
        });
      },
    });
  }

  onOpenEditForm(client: IClient) {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      data: client,
      maxWidth: '100%',
    });
    // Listen to the dialog close event to handle edit
    dialogRef.afterClosed().subscribe((result) => {
      const { clientId, changedValues } = result;
      this.clientService.updateClient$(clientId, changedValues).subscribe({
        next: () => {
          this.snackBarRef.open('Client edited.', '', { duration: 1000 });
        },
      });
    });
  }
}
