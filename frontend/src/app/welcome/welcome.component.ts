import { Component } from '@angular/core';

import { AuthComponent } from "../Auth/auth.component";


@Component({
  selector: 'app-welcome',
  imports: [ AuthComponent, ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {

}
