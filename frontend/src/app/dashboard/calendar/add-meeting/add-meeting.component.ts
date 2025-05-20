import { Component, EventEmitter, Output } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-meeting',
  imports: [ReactiveFormsModule],
  template: ` <div class="modal-overlay" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <form (ngSubmit)="addMeeting()">
        <label for="name">Name:</label>
        <input name="name" type="text" [formControl]="name" />
        <button type="submit">Save</button>
      </form>
      <button (click)="closeModal()">Close</button>
    </div>
  </div>`,
  styleUrl: './add-meeting.component.css',
})
export class AddMeetingComponent {
  @Output() close = new EventEmitter<void>();
  @Output() newMeeting = new EventEmitter<string>();

  name = new FormControl();

  closeModal(): void {
    this.close.emit();
  }
  addMeeting(): void {
    this.newMeeting.emit(this.name.value);
  }
}
