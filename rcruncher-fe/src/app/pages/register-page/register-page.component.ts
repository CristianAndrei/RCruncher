import { Component, OnInit } from '@angular/core';
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
  constructor( ) { }

  ngOnInit() {
  }
}
