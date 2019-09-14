import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { User } from './models/user';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cclient';
  user: User;

  constructor(private http: Http, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    if (storage.get('currentUser')) {
      this.user = storage.get('currentUser').user;
    }
  }

  logout() {
    this.storage.set('currentUser', null);
    window.location.reload();
  }

}
