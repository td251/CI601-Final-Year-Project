import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Login } from '../model/Login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  show: boolean;
  // need to change to validation
  login: Login;
  needsToSignUp = false;
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.show = false;
  }
  navigationDetails: string[] = ['/your-groups'];
  registerDetails: string[] = ['register'];

  ngOnInit(): void {
    this.loginForm = new FormGroup(
      {
        //form control 
        email: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
      });
    Notification.requestPermission(function (status) {
    });
    this.check();
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {
        reg.showNotification('Go go');
      });
    }
    //when opening the application the user name is set null
    localStorage.setItem('currentUser', '');
    // login form rules 


  }

  public check = () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('No Service Worker support!');
    }
    if (!('PushManager' in window)) {
      throw new Error('No Push API Support!');
    }
  }
  passwordDisplay() {
    //Show or hide the password 
    this.show = !this.show;
  }

  public signUp() {
    //navigate to register pager 
    this.router.navigate(this.registerDetails);
  }
  async signIn(loginForm) {
    //login is equal to the login form values 
    (await this.userService.login(loginForm.value)).subscribe(response => {
      //navigate to the home page 
      this.router.navigate(this.navigationDetails);
      this.toastr.success('Welcome ' + response.email);
      // set current user local storage to signed in user
      localStorage.setItem('currentUser', loginForm.value.email);
    }, error => {
      if (error.status == 404) {
        this.toastr.error('User has not been found please check credentials');
      }
      if (error.status == 401) {
        this.toastr.error('wrong password');
      }
    });
  }
}
