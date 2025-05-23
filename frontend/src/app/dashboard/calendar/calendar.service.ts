import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../Auth/Auth.service';
import { Meetings } from './meeting.model';
import { environment } from '../../../environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getMeetings() {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      return this.http.get<{
        results: Meetings;
      }>(environment.apiUrl + '/meeting/get', { params: { userId: userId } });
    } else return null;
  }

  createMeeting(date: string, name: string) {
    const userId = this.authService.user.getValue()?.userId;

    if (userId) {
      const meetingData = {
        userId: userId,
        dayOfMeeting: formatDate(date,'YYYY-MM-dd', "en_US"),
        name: name,

      };
      return this.http.post<{
        meeting: {
          meetingId: number;
          userId: string;
        };
      }>(environment.apiUrl + '/meeting/create', meetingData);
    } else {
      return null;
    }
  }

  deleteMeeting(id: number) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      return this.http.delete<{ message: string }>(
        environment.apiUrl + '/meeting/delete',
        { params: { meetingId: id } }
      );
    } else {
      return null;
    }
  }
  
  updateMeeting(
    id: number,
    name: string,

  ) {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
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
    } else {
      return null;
    }
  }
}
