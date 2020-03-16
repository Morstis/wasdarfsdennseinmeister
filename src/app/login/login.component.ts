import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginmessage = 'Angemeldet';
  loginTry: boolean;
  constructor(private afAuth: AngularFireAuth) {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }
  send(loginFormValue: { email: string; password: string }) {
    this.afAuth
      .signInWithEmailAndPassword(loginFormValue.email, loginFormValue.password)
      .catch(res => (this.loginmessage = 'Fehler: ' + res))
      .then(res => {
        this.loginmessage =
          res instanceof Object ? 'Angemeldet' : this.loginmessage;
        this.loginTry = true;
      });
  }
}
