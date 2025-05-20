import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { Meetings } from './meeting.model';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';

@Component({
  selector: 'app-calendar',
  imports: [NgClass, AddMeetingComponent, NgIf],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
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
    return this.meetings[activeDayISO] ?? [];
   
  });

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
  createMeeting(name: string) {
    const activeDay = this.activeDay();
    if (activeDay !== null) {
      const activeDayISO = activeDay.toISODate();
     
      if(activeDayISO!==null)
        if(!this.meetings[activeDayISO] ){
          this.meetings[activeDayISO] = [];
        } else{
          this.meetings[activeDayISO].push(name);
        }

        
      }
    }
  
}
