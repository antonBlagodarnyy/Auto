import { Component, inject, input, output } from '@angular/core';

import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CalendarService } from '../../../services/calendar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

interface DialogData {
  mode: string;
  activeDay: string;
  id: number;
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
    <form [formGroup]="nameInput" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Name:</mat-label>
        <input matInput name="name" type="text" formControlName="name" />
      </mat-form-field>
      <button mat-button type="submit">Save</button>
    </form>
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

  nameInput = new FormGroup({
    name: new FormControl(),
  });

  onSubmit(): void {
    const mode = this.data?.mode;
    if (this.nameInput.valid) {
      if (mode == 'create') {
        const activeDay = this.data?.activeDay;
        if (activeDay) {
          this.calendarService
            .createMeeting(activeDay, this.nameInput.get('name')?.value)
            ?.subscribe(() => {
              this.dialogRef?.close();
            });
        }
      } else if (mode == 'edit') {
        const id = this.data?.id;
        if (id)
          this.calendarService
            .updateMeeting(id, this.nameInput.get('name')?.value)
            ?.subscribe(() => {
              this.dialogRef?.close();
            });
      }
    }
  }
}
