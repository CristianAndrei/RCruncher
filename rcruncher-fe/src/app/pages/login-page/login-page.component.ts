import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/firebase-services/firebase-user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public email: string = '';
  public password: string = '';
  public invalidData: boolean = false;
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  login(): void {
    this.userService.login(this.email, this.password).subscribe((res) => {
      if (res) {
          this.router.navigate(['home']);
      } else {
          this.invalidData = true;
      }
  });
  }
}
