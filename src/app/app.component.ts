// Angular
import { Component } from '@angular/core';

// AngularFire
import { AngularFireAuth } from 'angularfire2/auth';

// Firestore
import User from 'firebase/auth';

// Pages
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomePage;
  opened: boolean = false;
  user: User = null;

  constructor(
    afAuth: AngularFireAuth
  ) {

    afAuth.authState.subscribe(_user => {
      this.user = _user;
    });

  }

  ////////////////////////////////////////////////////////////////
  // User Interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Switch the side bar nav
  */
  protected switchAccountSideBar(): void {
    this.opened = !this.opened;
  }

}

