import { Component, input, output } from '@angular/core';

import {
  FormControl,
  ReactiveFormsModule,
  NgForm,
  FormGroup,
} from '@angular/forms';
import { DateTime } from 'luxon';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-add-meeting',
  imports: [ReactiveFormsModule],
  template: ` <div class="modal-overlay" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <form [formGroup]="nameInput" (ngSubmit)="addMeeting()">
        <label for="name">Name:</label>
        <input name="name" type="text" formControlName="name" />
        <button type="submit">Save</button>
      </form>
      <button (click)="closeModal()">Close</button>
    </div>
  </div>`,
  styleUrl: './add-meeting.component.css',
})
export class AddMeetingComponent {
  constructor(private calendarService: CalendarService) {}

  close = output();
  activeDay = input<string>();

  nameInput = new FormGroup({
    name: new FormControl(),
  });

  closeModal(): void {
    this.close.emit();
  }
  addMeeting(): void {
    console.log(this.activeDay());
    const activatedDay = this.activeDay();

    if (activatedDay)
      this.calendarService
        .createMeeting(activatedDay, this.nameInput.get('name')?.value)
        ?.subscribe();
  }
}
