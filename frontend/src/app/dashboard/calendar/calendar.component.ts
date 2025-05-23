import { formatDate, NgClass, NgIf } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { Meetings } from './meeting.model';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { CalendarService } from './calendar.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  imports: [
    NgClass,
    MatChipsModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  constructor(private calendarService: CalendarService) {}

  meetingForm = inject(MatDialog);

  meetings: WritableSignal<Meetings> = signal({});

  today: Signal<DateTime> = signal(DateTime.local());

  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    this.today().startOf('month')
  );

  activeDay: WritableSignal<DateTime | null> = signal(null);

  weekDays: Signal<string[]> = signal(Info.weekdays('short'));

  daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth().startOf('week'),
      this.firstDayOfActiveMonth().endOf('month').endOf('week')
    )
      .splitBy({ day: 1 })
      .map((d) => {
        if (d.start == null) {
          throw new Error('Wrong dates');
        }
        return d.start;
      });
  });

  DATE_MED = DateTime.DATE_MED;

  activeDayMeetings: Signal<string[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) {
      return [];
    }

    const activeDayISO = activeDay.toISODate();
    if (!activeDayISO) {
      return [];
    }
    return (
      this.meetings()[formatDate(activeDayISO, 'YYYY-MM-dd', 'en_US')] ?? []
    );
  });

  ngOnInit(): void {
    this.updateMeetings();
  }

  goToPreviousMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().minus({ month: 1 })
    );
  }
  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().plus({ month: 1 })
    );
  }
  goToToday(): void {
    this.firstDayOfActiveMonth.set(this.today().startOf('month'));
  }

  addMeeting(activeDay: string) {
    const dialogRef = this.meetingForm.open(AddMeetingComponent, {
      data: {
        activeDay: activeDay,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.updateMeetings();
    });
  }
  updateMeetings() {
    this.calendarService.getMeetings()?.subscribe((result) => {
      this.meetings.set(result.results);
    });
  }
}
