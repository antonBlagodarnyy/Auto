import { Component, inject, OnInit, Signal } from '@angular/core';
import { IClient } from '../../Interfaces/IClient';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientService } from '../../services/clients.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientTableComponent } from './client-table/client-table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewportService } from '../../services/viewport.service';
import { MobileClientsComponent } from '../mobile/mobile-clients/mobile-clients.component';

@Component({
  selector: 'app-clients',
  imports: [
    MatDialogModule,
    ClientTableComponent,
    MatButtonModule,
    MatIconModule,
    MobileClientsComponent,
  ],
  template: `
    <div class="container">
      <button class="btn-add" mat-fab extended (click)="onOpenCreateForm()">
        <mat-icon>add</mat-icon>Add client
      </button>
      @if(isSmallScreen()?.matches){
      <app-mobile-clients
        [clients]="clients"
        (deleteEvent)="onDeleteClient($event)"
        (openEditFormEvent)="onOpenEditForm($event)"
      />
      }@else{
      <app-client-table
        class="table"
        [clients]="clients()"
        (deleteEvent)="onDeleteClient($event)"
        (openEditFormEvent)="onOpenEditForm($event)"
      />
      }
    </div>
  `,
  styles: `
  .table{
    width: 90vw;
  }
  .btn-add{
    margin: 2rem;
  }
  .container{
  display: flex;
  flex-direction: column;
  align-items: center;
  }`,
})
export class ClientsComponent implements OnInit {
  constructor(private dialog: MatDialog, private snackBarRef: MatSnackBar) {}
  private viewportService = inject(ViewportService);
  private clientService = inject(ClientService);

  isSmallScreen = toSignal(this.viewportService.isSmallScreen$);

  clients: Signal<IClient[]> = toSignal(this.clientService.clients$, {
    initialValue: [],
  });

  ngOnInit(): void {
    this.clientService.getStoredClients$().subscribe();
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
    });
    // Listen to the dialog close event to handle edit
    dialogRef.afterClosed().subscribe((editedClient) => {
      if (editedClient) {
        const { clientId, changedValues } = editedClient;
        this.clientService.updateClient$(clientId, changedValues).subscribe({
          next: () => {
            this.snackBarRef.open('Client edited.', '', { duration: 1000 });
          },
        });
      }
    });
  }
  onOpenCreateForm() {
    const dialogRef = this.dialog.open(ClientFormComponent);
    // Listen to the dialog close event to handle edit
    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          newClient: { name: string; phone: string; email: string };
        }) => {
          if (result) {
            const { name, phone, email } = result.newClient;
            this.clientService
              .addNewClient$({ name: name, phone: +phone, email: email })
              .subscribe({
                next: () => {
                  this.snackBarRef.open('Client added.', '', {
                    duration: 1000,
                  });
                },
              });
          }
        }
      );
  }
}
