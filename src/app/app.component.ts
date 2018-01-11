// Framework
import { Component } from '@angular/core';

// Pages
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor() {
  }
}

