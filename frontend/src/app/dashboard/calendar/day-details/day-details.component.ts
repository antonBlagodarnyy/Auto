import {
  Component,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateTime } from 'luxon';
import { CalendarService } from '../../../services/calendar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { IMeeting } from '../../../Interfaces/IMeetings';
import { MatIconModule } from '@angular/material/icon';
import { DayDetailsFormComponent } from './day-details-form/day-details-form.component';

type IDialogData = {
  selectedDay: DateTime;
  meetings: Signal<IMeeting[]>;
};

@Component({
  selector: 'app-day-details',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    DayDetailsFormComponent,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ dialogData.selectedDay.day }}-{{
        dialogData.selectedDay.monthShort
      }}-{{ dialogData.selectedDay.year }}
    </h2>

    <app-day-details-form (onCreateEvent)="onCreate($event)" />

    <mat-dialog-content>
      @if(this.dialogData.meetings().length == 0){
      <h4>You haven't created any meetings for this day.</h4>
      } @else { @for (meeting of this.dialogData.meetings(); track meeting.id) {

      <mat-card>
        @if(this.editMode().edit && this.editMode().meetingId == meeting.id){
        <app-day-details-form
          [editMode]="this.editMode()"
          (onEditSavedEvent)="onEditSaved($event)"
          (onCancelEditEvent)="onCancelEdit()"
        />
        } @else {
        <mat-card-content>
          <h4>{{ meeting.name }}</h4>
        </mat-card-content>
        }
        <mat-card-actions>
          <button mat-icon-button (click)="onEdit(meeting.id, meeting.name)">
            <mat-icon fontIcon="edit" />
          </button>
          <button mat-icon-button (click)="onDelete(meeting.id)">
            <mat-icon fontIcon="delete" />
          </button>
        </mat-card-actions>
      </mat-card>

      } }
    </mat-dialog-content>
`,
  styles: `

mat-card{
  margin: 2vh;
}
mat-card-content{
  overflow-wrap: break-word;
}
  `,
})
export class DayDetailsComponent {
  constructor(
    private calendarService: CalendarService,
    private snackBar: MatSnackBar
  ) {}

  readonly dialogData = inject<IDialogData>(MAT_DIALOG_DATA, {});

  name: string | undefined;

  editMode: WritableSignal<{
    edit: boolean;
    meetingId: number | null;
    oldName: string | null;
  }> = signal({ edit: false, meetingId: null, oldName: null });

  onCreate(name: string) {
    this.calendarService
      .addNewMeeting$(this.dialogData.selectedDay, name)
      .subscribe({
        next: () =>
          this.snackBar.open('Event created.', '', {
            duration: 1000,
          }),
        error: () =>
          this.snackBar.open('Event not added.', '', {
            duration: 1000,
          }),
      });
  }
  onDelete(meetingId: number) {
    this.calendarService
      .deleteMeeting$(meetingId, this.dialogData.selectedDay)
      .subscribe({
        next: () =>
          this.snackBar.open('Event deleted.', '', {
            duration: 1000,
          }),
        error: () =>
          this.snackBar.open('Event not deleted.', '', {
            duration: 1000,
          }),
      });
  }
  onEdit(meetingId: number, name: string) {
    this.editMode.set({ edit: true, meetingId: meetingId, oldName: name });
  }
  onEditSaved($event: { newName: string; meetingId: number }) {
    this.calendarService
      .updateMeeting$(
        $event.meetingId,
        $event.newName,
        this.dialogData.selectedDay
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Event edited.', '', {
            duration: 1000,
          });
          this.editMode.set({ edit: false, meetingId: null, oldName: null });
        },
        error: () =>
          this.snackBar.open('Event not edited.', '', {
            duration: 1000,
          }),
      });
  }
  onCancelEdit() {
    this.editMode.set({ edit: false, meetingId: null, oldName: null });
  }
}
