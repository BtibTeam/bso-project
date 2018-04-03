// Angular
import { Component } from '@angular/core';

// AngularFire
import { AngularFireAuth } from 'angularfire2/auth';

// Firestore
import User from 'firebase/auth';

// Models
import { Config } from '../model/config-model';

// Pages
import { HomePage } from '../pages/home/home';

// Providers
import { ConfigProvider } from '../providers/config/config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  private rootPage: any = HomePage;
  private opened: boolean = false;
  
  private user: User = null;
  private config: Config = new Config(); // Config object
  private lastPublicationText: string = '';
  
  constructor(
    private afAuth: AngularFireAuth,
    private configPvd: ConfigProvider,    
  ) {

    afAuth.authState.subscribe(_user => {
      this.user = _user;
    });

  }

  ////////////////////////////////////////////////////////////////
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  public ngOnInit(): void {

    this.configPvd.loadConfig();
    this.configPvd.config$.subscribe(config => {

      this.config = config;
      this.lastPublicationText = 'Last publication on ' + new Date(config.lastPublication).toLocaleDateString();
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

