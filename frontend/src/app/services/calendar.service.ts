import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMeetings } from '../Interfaces/IMeetings';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, tap } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}
  private meetingsSubject = new BehaviorSubject<IMeetings>({});
  readonly meetings$ = this.meetingsSubject.asObservable();

  setMeetings(meetings: IMeetings) {
    this.meetingsSubject.next(meetings);
  }

  getStoredMeetings$() {
    return this.http
      .get<{
        results: IMeetings;
      }>(environment.apiUrl + '/meeting/get')
      .pipe(map((res) => this.setMeetings(res.results)));
  }

  addNewMeeting$(date: DateTime, name: string) {
    const parsedDate = date.toFormat('yyyy-MM-dd');
    console.log(parsedDate);
    const meetingData = {
      dayOfMeeting: parsedDate,
      name: name,
    };
    return this.http
      .post<{
        meetingId: number;
      }>(environment.apiUrl + '/meeting/create', meetingData)
      .pipe(
        map((res) => {
          const current = this.meetingsSubject.value;

          const updated = {
            ...current,
            [parsedDate]: [
              ...(current[parsedDate] ?? []),
              {
                id: res.meetingId,
                name: name,
              },
            ],
          };
          this.meetingsSubject.next(updated);
        })
      );
  }

  deleteMeeting$(id: number, date: DateTime) {
    const parsedDate = date.toFormat('yyyy-MM-dd');
    return this.http
      .delete(environment.apiUrl + '/meeting/delete', {
        body: { meetingId: id },
        responseType: 'text',
      })
      .pipe(
        tap(() => {
          const current = this.meetingsSubject.value;
          const parsedCurrent = {
            ...current,
            [parsedDate]: current[parsedDate].filter((m) => m.id !== id),
          };
          this.meetingsSubject.next(parsedCurrent);
        })
      );
  }

  updateMeeting$(id: number, name: string, date: DateTime) {
    const parsedDate = date.toFormat('yyyy-MM-dd');
    return this.http
      .put(
        environment.apiUrl + '/meeting/update',
        {
          meetingId: id,
          name: name,
        },
        {
          responseType: 'text',
        }
      )
      .pipe(
        tap(() => {
          const current = this.meetingsSubject.value;
          current[parsedDate].map((m) => {
            if (m.id == id) m.name = name;
            return m;
          });
          this.meetingsSubject.next(current);
        })
      );
  }
}
