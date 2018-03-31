// Angular
import { Injectable } from '@angular/core';

// Models
import { Config } from '../../model/config-model';

// Providers
import { FirestoreProvider } from '../firestore/firestore';

// RxJs
import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigProvider {

  constructor(
    private firestorePvd: FirestoreProvider) {
  }

  public config$: Observable<Config> = Rx.Observable.empty();

  ////////////////////////////////////////////////////////////////
  // Public
  ////////////////////////////////////////////////////////////////

  /**
   * Read the Database config 
   */
  public loadConfig(): void {

    this.config$ = this.firestorePvd.readDocument('config/parameters');

  }

  /**
   * Update the version
   * @param version 
   * @return a void promise
   */
  public updateVersion(config: Config): Promise<void> {

    return this.firestorePvd.set(config, 'config/parameters');

  }


}
