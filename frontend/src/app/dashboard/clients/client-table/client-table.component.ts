import {
  Component,
  effect,
  input,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IClient } from '../../../Interfaces/IClient';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-client-table',
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './client-table.component.html',
  styles: `table{
    padding: 1vh;
    border-width: 1px;
    border-color: black;
    border-radius: 10px 10px 0 0;
  }
  mat-paginator{
    border-radius: 0 0 10px 10px;
  }`,
})
export class ClientTableComponent implements OnInit {
  clients = input<IClient[]>([]);
  deleteEvent = output<number>();
  openEditFormEvent = output<IClient>();
  columnsToDisplay = ['name', 'phone', 'email', 'actions'];
  dataSource = new MatTableDataSource<IClient>();
  paginator = viewChild(MatPaginator);
  constructor() {
    effect(() => {
      this.dataSource.data = this.clients();
    });
  }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator()!;
  }
  onDelete(clientId: number) {
    this.deleteEvent.emit(clientId);
  }
  onEdit(client: IClient) {
    this.openEditFormEvent.emit(client);
  }
}
