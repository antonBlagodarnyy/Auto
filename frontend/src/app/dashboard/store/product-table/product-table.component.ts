import { Component, effect, input, output, viewChild } from '@angular/core';
import { IProduct } from '../../../Interfaces/IProduct';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-table',
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule, CurrencyPipe],
  templateUrl: './product-table.component.html',
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
export class ProductTableComponent {
  products = input<IProduct[]>([]);
  deleteEvent = output<number>();
  openEditFormEvent = output<IProduct>();
  columnsToDisplay = ['title', 'description', 'stock', 'price', 'actions'];
  dataSource = new MatTableDataSource<IProduct>();
  paginator = viewChild(MatPaginator);
  constructor() {
    effect(() => {
      this.dataSource.data = this.products();
    });
  }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator()!;
  }
  onDelete(productId: number) {
    this.deleteEvent.emit(productId);
  }
  onEdit(product: IProduct) {
    this.openEditFormEvent.emit(product);
  }
}
