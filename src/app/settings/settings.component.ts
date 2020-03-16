import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { BehaviorSubject } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(private appRoot: AppComponent) {}
  theme$: BehaviorSubject<boolean> = this.appRoot.darkTheme$;
  changeTheme(value: MatSlideToggleChange) {
    this.appRoot.darkTheme$.next(value.checked);
  }
}
