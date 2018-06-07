// Framework
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Models
import { ChangelogItem } from '../../model/change-log-model';

// Providers
import { ChangelogProvider } from '../../providers/change-log/change-log';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private changelogs: ChangelogItem[] = [];

  constructor(
    private navCtrl: NavController,
    private changelogPvd: ChangelogProvider
  ) { }


  ////////////////////////////////////////////////////////////////
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  /**
   * Override
   */
  private ngOnInit(): void {
    this.changelogPvd.loadChangeLogs();
    this.changelogPvd.changelogs$.subscribe(changelogs => {
      this.changelogs = changelogs;
    });
  }

  ////////////////////////////////////////////////////////////////
  // User Interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Open the given page
   * @param page 
   */
  protected openPage(page: string): void {
    this.navCtrl.push(page);
  }

}
