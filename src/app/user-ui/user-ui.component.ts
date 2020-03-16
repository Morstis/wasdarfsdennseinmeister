import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Gericht } from '../interfaces/gericht';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { user } from '../interfaces/user';
import 'firebase/database';

import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-user-ui',
  templateUrl: './user-ui.component.html',
  styleUrls: ['./user-ui.component.scss'],
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
export class UserUIComponent {
  gerichte$: Observable<Gericht[]>;
  form: FormGroup;
  gericht: Gericht = {} as Gericht;
  userRef: AngularFireList<user>;
  users$: Observable<user[]>;
  constructor(private db: AngularFireDatabase) {
    this.gerichte$ = db.list<Gericht>('gerichte').valueChanges();
    this.userRef = db.list<user>('users');
    this.users$ = this.userRef.valueChanges();
    this.form = new FormGroup({
      vorname: new FormControl(''),
      gericht: new FormGroup({
        name: new FormControl(),
        groesse: new FormControl({ value: '', disabled: true }),
        preis: new FormControl({ value: '', disabled: true })
      })
    });
  }
  send(formValue) {
    const userpGericht: user = formValue;
    userpGericht.gericht = { ...userpGericht.gericht, ...this.gericht };
    this.userRef.push(userpGericht);
  }
  updateForm(index) {
    this.gerichte$.pipe(take(1)).subscribe(res => {
      this.gericht.groesse = res[index].groesse;
      this.gericht.preis = res[index].preis;

      this.form.patchValue({ gericht: { groesse: res[index].groesse } });
      this.form.patchValue({ gericht: { preis: res[index].preis } });
    });
  }
  trackFbObjects = (idx, obj) => obj.$key;
}
