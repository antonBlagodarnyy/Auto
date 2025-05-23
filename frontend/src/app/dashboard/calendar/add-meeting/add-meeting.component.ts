import { Component, inject, input, output } from '@angular/core';

import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CalendarService } from '../calendar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

interface DialogData {
  activeDay: string;
}

@Component({
  selector: 'app-add-meeting',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <div (click)="$event.stopPropagation()">
      <form [formGroup]="nameInput" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Name:</mat-label>
          <input matInput name="name" type="text" formControlName="name" />
        </mat-form-field>
        <button mat-button type="submit">Save</button>
      </form>
    </div>
  `,
  styles: `form {
  display: flex;
  justify-content: space-around;
}`,
})
export class AddMeetingComponent {
  constructor(private calendarService: CalendarService) {}
  private dialogRef = inject(MatDialogRef, { optional: true });
  data = inject<DialogData>(MAT_DIALOG_DATA, { optional: true });
  close = output();

  nameInput = new FormGroup({
    name: new FormControl(),
  });

  onSubmit(): void {
    if (this.nameInput.valid) {
      const activeDay = this.data?.activeDay;
      if (activeDay) {
        this.calendarService
          .createMeeting(activeDay, this.nameInput.get('name')?.value)
          ?.subscribe(() => {
            this.dialogRef?.close();
          });
      }
    }
  }
}
