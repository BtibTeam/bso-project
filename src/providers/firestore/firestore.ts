// Framework
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

// Firestore
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class FirestoreProvider {

  constructor(
    public db: AngularFirestore) {
  }


  //////////////////////////////////////////////////////
  // Read
  //////////////////////////////////////////////////////

  /**
   * Read documents of a collection 
   * Store results in an array of objects (including id)
   * @param path of a collection
   * @param query
   */
  public readCollection(path: string, query?: any): Observable<any[]> {

    return this.db.collection(path, query)
      .snapshotChanges()
      .map(actions => {
        return actions
          .filter(({ payload }) => payload.doc.exists)
          .map(({ payload }) => {
            const { id } = payload.doc;
            const data = payload.doc.data()
            return { id, ...data };
          }
          );
      });
  }

  /**
   * Read the common part of an object
   * @param path
   */
  public readDocument(path: string): Observable<any> {

    return this.db.doc(path).snapshotChanges()
      .map(({ payload }) => {
        const data = payload.data();
        const { id } = payload;
        return { id, ...data };
      });
  }

  //////////////////////////////////////////////////////
  // Document
  //////////////////////////////////////////////////////

  /**
   * Generate a new id
   */
  public generateId(): string {
    return this.db.createId();
  }

  /**
   * Set a document
   * @param object 
   * @param path
   */
  public set(object: any, path: string) {
    return this.db.doc(path).set(object);
  }

  /**
   * Update a document
   * @param object 
   * @param path
   */
  public update(object: any, path: string) {
    return this.db.doc(path).update(object);
  }

  /**
   * Delete a document
   * @param path 
   */
  public delete(path: string) {
    return this.db.doc(path).delete();
  }
}
