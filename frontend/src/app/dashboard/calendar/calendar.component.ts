import { formatDate, NgClass, NgIf } from '@angular/common';
import {
  Component,
  computed,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { Meetings } from './meeting.model';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  imports: [NgClass, AddMeetingComponent, NgIf],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  constructor(private calendarService: CalendarService) {}


  showAddMeeting: boolean = false;

  meetings: Meetings = {};

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
    return this.meetings[formatDate(activeDayISO,'YYYY-MM-dd', "en_US")] ?? [];
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
  switchAddMeeting() {
    this.showAddMeeting = !this.showAddMeeting;
  }
  updateMeetings() {
    this.calendarService.getMeetings()?.subscribe((result) => {
      this.meetings = result.results;

    });
    console.log(this.meetings)
  }
}
