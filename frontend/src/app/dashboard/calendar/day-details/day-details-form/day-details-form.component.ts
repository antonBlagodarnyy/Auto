import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-day-details-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: ` <form (ngSubmit)="onSubmit()">
    <mat-form-field appearance="outline" hintLabel="Max 20 characters">
      <mat-label>
        @if(!this.editMode().edit){ New event: } @else { Edit event: }
      </mat-label>
      <input
        matInput
        id="name"
        name="name"
        maxlength="20"
        type="text"
        [(ngModel)]="name"
      />
      <mat-hint align="end">{{ name?.length }}/20</mat-hint>
    </mat-form-field>
    <div class="container-actions">
      <button mat-raised-button type="submit">Save</button>
      @if(this.editMode().edit){
      <button mat-icon-button type="button" (click)="onCancelEditEvent.emit()">
        <mat-icon fontIcon="cancel" />
      </button>
      }
    </div>
  </form>`,
  styles: `form{
    padding:2vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
 }
 mat-form-field{
  width: 100%;
 }
 form button {
  margin-top: 1rem;
 }
 .container-actions{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
 }`,
})
export class DayDetailsFormComponent implements OnInit {
  constructor(private snackBarRef: MatSnackBar) {}
  name: string | undefined;
  onCreateEvent = output<string>();
  onEditSavedEvent = output<{ newName: string; meetingId: number }>();
  onCancelEditEvent = output();
  editMode = input<{
    edit: boolean;
    meetingId: number | null;
    oldName: string | null;
  }>({ edit: false, meetingId: null, oldName: null });

  ngOnInit(): void {
    const { edit, meetingId, oldName } = this.editMode();
    if (edit && meetingId && oldName) this.name = oldName;
  }
  onSubmit() {
    if (this.name) {
      const { edit, meetingId, oldName } = this.editMode();
      if (edit && meetingId && oldName) {
        if (oldName !== this.name) {
          this.onEditSavedEvent.emit({
            newName: this.name,
            meetingId: meetingId,
          });
        } else
          this.snackBarRef.open('Meeting was not edited.', '', {
            duration: 1000,
          });
      } else this.onCreateEvent.emit(this.name);
    }
  }
}
