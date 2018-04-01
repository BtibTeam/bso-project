// Angular
import { Injectable } from '@angular/core';

// AngularFire
import { AngularFireAuth } from 'angularfire2/auth';

// Firestore
import * as firebase from 'firebase/app';

@Injectable()
export class FireAuthProvider {

  constructor(
    private afAuth: AngularFireAuth,
  ) { }

  ////////////////////////////////////////////////////////////////
  // Public Methods
  ////////////////////////////////////////////////////////////////

  /**
   * Sign in the user
   * @param email 
   * @param password 
   */
  signInWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Sign out the user
   */
  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

}
