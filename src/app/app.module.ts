// Framework
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// Providers
import { NodeHandlerProvider } from '../providers/node-handler/node-handler';
import { NodeDataProvider } from '../providers/node-data/node-data';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    NodeHandlerProvider,
    NodeDataProvider
  ]
})
export class AppModule { }
