// Framework
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// Providers
import { NodeHandlerProvider } from '../providers/node-handler/node-handler';
import { NodeDataProvider } from '../providers/node-data/node-data';
import { FirestoreProvider } from '../providers/firestore/firestore';

// Firestore config
const config = {
  apiKey: "AIzaSyDLBB_EB-KcPswmnvblVtbrZvM0PPF1E8k",
  authDomain: "hso-project.firebaseapp.com",
  databaseURL: "https://hso-project.firebaseio.com",
  projectId: "hso-project",
  storageBucket: "hso-project.appspot.com",
  messagingSenderId: "856263060419"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // enablePersistence(): Offline data
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    NodeHandlerProvider,
    NodeDataProvider,
    FirestoreProvider
  ]
})
export class AppModule { }
