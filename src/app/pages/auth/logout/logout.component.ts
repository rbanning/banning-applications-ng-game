import { Component } from '@angular/core';
import { AuthService } from '@app/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(private authService: AuthService) { 
    this.authService.logout();
  }

}
