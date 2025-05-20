import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../Auth/Auth.service';
import { Meetings } from './meeting.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getMeetings() {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      return this.http.get<{
        results: Meetings[];
      }>(environment.apiUrl + '/meeting/get', { params: { userId: userId } });
    } else return null;
  }

  createMeeting(date: Date, name: string) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      const meetingData = {
        userId: userId,
        date: date.toDateString(),
        name: name,

      };
      return this.http.post<{
        meeting: {
          meetingId: number;
          userId: string;
          phone: number;
          dayOfMeeting: string;
        };
      }>(environment.apiUrl + '/meeting/create', meetingData);
    } else {
      return null;
    }
  }

}
