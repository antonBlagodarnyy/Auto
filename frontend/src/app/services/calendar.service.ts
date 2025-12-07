import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Meetings } from '../dashboard/calendar/meeting.model';
import { environment } from '../../environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}

  getMeetings() {
    return this.http.get<{
      results: Meetings;
    }>(environment.apiUrl + '/meeting/get');
  }

  createMeeting(date: string, name: string) {
    const meetingData = {
      dayOfMeeting: formatDate(date, 'YYYY-MM-dd', 'en_US'),
      name: name,
    };
    return this.http.post<{
      meeting: {
        meetingId: number;
        userId: string;
      };
    }>(environment.apiUrl + '/meeting/create', meetingData);
  }

  deleteMeeting(id: number) {
    return this.http.delete<{ message: string }>(
      environment.apiUrl + '/meeting/delete',
      { params: { meetingId: id } }
    );
  }

  updateMeeting(id: number, name: string) {
    const meetingData = {
      meeting: id,
      name: name,
    };
    return this.http.put<{
      meeting: {
        meetingId: number;
        name: string;
      };
    }>(environment.apiUrl + '/meeting/update', meetingData);
  }
}
