import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {AuthFirebaseSerivce} from '../../services/firebase-services/firebase-auth.service';
import {UserService} from '../../services/firebase-services/firebase-user.service';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user-models/user.model';
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  constructor( private authFirebaseSerivce: AuthFirebaseSerivce, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  register(): void {
    const userModel = new UserModel(this.firstName, this.lastName, this.email);
    this.authFirebaseSerivce.register(userModel.email, this.password).subscribe((result) => {
        if (result) {
            this.userService.login(userModel.email, this.password).subscribe((res) => {
                if (res) {
                    this.userService.createUser(userModel);
                    this.router.navigate(['home']);
                }
            });
        }
    });
  }
}
