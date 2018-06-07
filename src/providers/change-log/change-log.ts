// Angular
import { Injectable } from '@angular/core';

// Libraries
import { plainToClass } from "class-transformer";

// Models
import { ChangelogItem } from '../../model/change-log-model';

// Providers
import { FirestoreProvider } from '../firestore/firestore';

// RxJs
import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class ChangelogProvider {

  constructor(
    private firestorePvd: FirestoreProvider) {
  }

  public changelogs$: Observable<ChangelogItem[]> = Rx.Observable.empty();

  ////////////////////////////////////////////////////////////////
  // Public
  ////////////////////////////////////////////////////////////////

  /**
   * Read the Database release notes 
   */
  public loadChangeLogs(): void {

    this.changelogs$ = this.firestorePvd.readCollection('changelog', ref => ref.orderBy('version', 'desc').limit(3))
      .map(changelog$ => { // changelog: Observable<ChangelogItem>

        // For each changelog
        changelog$.map(changelog => {
          return plainToClass(ChangelogItem, changelog as Object);
        });

        return changelog$;

      });

  }

  /**
   * Update the version
   * @param version 
   * @return a void promise
   */
  public updateChangelog(changelog: ChangelogItem): Promise<void> {

    return this.firestorePvd.set(JSON.parse(JSON.stringify(changelog)), 'changelog/' + this.firestorePvd.generateId());

  }


}
