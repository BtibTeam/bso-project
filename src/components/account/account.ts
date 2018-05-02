// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

// Firestore
import User from 'firebase/auth';

// Provider
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

@Component({
  selector: 'account',
  templateUrl: 'account.html'
})
export class AccountComponent {

  // Inputs
  @Input('user') private user: User = null;

  // Outputs
  @Output() private loggedIn: EventEmitter<void> = new EventEmitter<void>();

  private loginForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private authPvd: FireAuthProvider
  ) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(2), Validators.required])],
    });

  }

  ////////////////////////////////////////////////////////////////
  // User Interactions
  ////////////////////////////////////////////////////////////////

  /**
   * SignIn the user to the Database
   */
  protected signIn(): void {
    this.authPvd.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(() => {
      this.loggedIn.emit();
    });
  }


  /**
   * Sign out the user to the Database
   */
  protected signOut(): void {
    this.authPvd.signOut();
  }

}
