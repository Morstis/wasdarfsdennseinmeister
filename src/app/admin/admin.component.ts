import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'firebase/database';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Gericht } from '../interfaces/gericht';
import { user } from '../interfaces/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('log', [
      state('void', style({ transform: 'translateX(100%)' })),

      transition(':leave', [animate('350ms ease-out')]),

      transition(':enter', [
        style({ transform: 'translatex(-100%)' }),
        animate('350ms ease-in')
      ])
    ])
  ]
})
export class AdminComponent {
  form: FormGroup;
  trigger = false;
  gerichte$: Observable<Gericht[]>;
  gerichteRef: AngularFireList<Gericht>;
  error: string;

  @ViewChild('log') log: ElementRef;
  @ViewChild('firstInput') firstInput: ElementRef;

  constructor(private db: AngularFireDatabase) {
    // Referenz: https://github.com/angular/angularfire/blob/fb4159d92cc0090acfad7b7d1424ed93c4660b0e/docs/rtdb/lists.md
    this.gerichteRef = db.list<Gericht>('gerichte');
    // Use snapshotChanges().map() to store the key
    this.gerichte$ = this.gerichteRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
    this.form = new FormGroup({
      name: new FormControl(''),
      groesse: new FormControl(''),
      preis: new FormControl('')
    });
  }

  send(formValue: Gericht) {
    this.gerichteRef
      .push(formValue)
      .catch(err => (this.error = err.message))
      .then(res => {
        this.form.reset();
        this.firstInput.nativeElement.focus();
        this.showUpdate();
        this.log.nativeElement.scrollTop =
          this.log.nativeElement.scrollHeight -
          this.log.nativeElement.clientHeight;
      });
  }
  deleteGericht(key) {
    this.gerichteRef.remove(key);
  }
  trackFbObjects = (idx, obj) => obj.$key;

  async showUpdate() {
    this.trigger = true;
    setTimeout(() => {
      this.trigger = false;
    }, 3000);
  }
  removeUserList() {
    this.db
      .list<user>('users')
      .remove()
      .then(res => {
        this.showUpdate();
        console.log(res);
      });
  }
}
