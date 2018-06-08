// Angular
import { Injectable } from '@angular/core';

// Libraries
import { plainToClass } from "class-transformer";

// Models
import { ModificationRequest } from '../../model/modification-request-model';

// Providers
import { FirestoreProvider } from '../firestore/firestore';

// RxJs
import Rx from 'rxjs/Rx';

@Injectable()
export class ModificationRequestProvider {

  constructor(
    private firestorePvd: FirestoreProvider) {
  }

  public modificationRequests$: Rx.Observable<ModificationRequest[]> = Rx.Observable.empty();

  ////////////////////////////////////////////////////////////////
  // Public
  ////////////////////////////////////////////////////////////////

  /**
   * Read the Database modification requests
   */
  public loadModificationRequests(): void {

    this.modificationRequests$ = this.firestorePvd.readCollection('modificationRequest', ref => ref.orderBy('timestamp', 'desc'))
      .map(modificationRequest$ => { // changelog: Observable<ModificationRequest>

        // For each changelog
        modificationRequest$.map(modificationRequest => {
          return plainToClass(ModificationRequest, modificationRequest as Object);
        });

        return modificationRequest$;

      });

  }

  /**
   * Create the modification request
   * @param request 
   * @return a void promise
   */
  public createModificationRequest(request: ModificationRequest): Promise<void> {

    return this.firestorePvd.set(JSON.parse(JSON.stringify(request)), 'modificationRequest/' + this.firestorePvd.generateId());

  }


}
