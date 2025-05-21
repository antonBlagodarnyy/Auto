import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  template: `<div class="container">
    <h1 mat-dialog-title>An error occurred</h1>
    <div mat-dialog-content>
      <p class="mat-body-1">{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Okay</button>
    </div>
  </div>`,
 
    imports:[MatDialogModule]
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
