import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth) {}
  darkTheme$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem('darkTheme'))
  );

  ngOnInit() {
    this.darkTheme$.subscribe(res => {
      localStorage.setItem('darkTheme', JSON.stringify(res));
    });
  }
  logout() {
    this.afAuth.signOut();
  }
}
