import { formatDate, NgClass } from '@angular/common';
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
import { IMeeting, IMeetings } from '../../Interfaces/IMeetings';
import { CalendarService } from '../../services/calendar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { toSignal } from '@angular/core/rxjs-interop';
import { DayDetailsComponent } from './day-details/day-details.component';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-calendar',
  imports: [
    NgClass,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatBadgeModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  private calendarService = inject(CalendarService);

  meetings: Signal<IMeetings> = toSignal(this.calendarService.meetings$, {
    initialValue: {},
  });

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

  activeDayMeetings: Signal<IMeeting[]> = computed(() => {
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
    this.calendarService.getStoredMeetings$().subscribe();
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

  openDay(selectedDay: DateTime) {
    this.dialog.open(DayDetailsComponent, {
      width: '80%',
      maxWidth: '100%',
      data: { selectedDay: selectedDay, meetings: this.activeDayMeetings },
    });
  }
 
}
