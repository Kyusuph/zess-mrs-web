import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { ApplicationState } from '../store';
import { Go } from '../store/router/router.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authenticating = false;
  showPassword = false;
  constructor(private formbBuilder: FormBuilder, private userService:UserService,private store:Store<ApplicationState>) { }

  ngOnInit(): void {
    this.loginForm = this.formbBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  get username (){
    return this.loginForm.value['username'];
  }

  get password() {
    return this.loginForm.value['password'];
  }

  async login() {
    this.authenticating = true;
    console.log({username: this.username, password:this.password});
    try {
      await this.userService.login({username:this.username,password:this.password}).toPromise();
      this.store.dispatch(new Go({path:['']}));
    }catch(e) {
      console.error('Error login', e);
    }
    this.authenticating = false;
  } 

}
