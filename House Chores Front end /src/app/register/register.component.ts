import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      userName: new FormControl('', [Validators.required, this.noWhiteSpaceValidation]),
      email: new FormControl('', [Validators.required, this.noWhiteSpaceValidation]),
      name: new FormControl('', [Validators.required, this.noWhiteSpaceValidation]),
      //password must be at least 6 characters before user is allowed to register 
      password: new FormControl('', [Validators.required,
      this.noWhiteSpaceValidation, Validators.minLength(6)]),

    });
  }
  //username email or password cant contain any white space

  noWhiteSpaceValidation(control: FormControl) {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContainSpace: true }
    }
    return null;
  }
  async createUser(user) {

    const name = user.value.name;
    const email = user.value.email;
    (await this.userService.newUser(user.value)).subscribe(response => {
      //toastr message to display when user has sucessfully logged in 
      this.toastr.success('Congratulations ' + name + ' you are one step closer to an organized household');
    },
      error => {
        //conflict error if user with an existing account sets one up 
        if (error.status == 409) {
          this.toastr.error(email + ' already has an account');

        }
      });
  }
  async signUp(registerForm) {


    (await this.userService.newUser(registerForm.value)).subscribe(respone => {


    });
  }
  backToLogin() {
    this.router.navigate(['']);

  }

}
