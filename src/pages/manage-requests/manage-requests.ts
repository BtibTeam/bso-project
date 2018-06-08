// Angular
import { Component } from '@angular/core';

// Angular Material
import { MatTableDataSource, MatDialog } from '@angular/material';

// Ionic
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Models
import { ModificationRequest } from '../../model/modification-request-model';

// Providers
import { ModificationRequestProvider } from '../../providers/modification-request/modification-request';

@IonicPage()
@Component({
  selector: 'page-manage-requests',
  templateUrl: 'manage-requests.html',
})
export class ManageRequestsPage {

  // Internal variables
  public requests: ModificationRequest[] = [];
  public displayedColumns = ['timestamp', 'publicId', 'subject', 'language', 'newLanguage', 'originalNodeName', 'field', 'value1', 'value2'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    public navCtrl: NavController,
    public modificationRequestsPvd: ModificationRequestProvider) {
  }

  ////////////////////////////////////////////////////////////////
  // Life Cycles
  ////////////////////////////////////////////////////////////////

  /**
   * Override
   */
  public ngOnInit(): void {
    this.modificationRequestsPvd.loadModificationRequests();
    this.modificationRequestsPvd.modificationRequests$.subscribe(_requests => {
      this.requests = _requests;
      this.dataSource = new MatTableDataSource(this.requests);
    });

  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Handle search bar value
   * @param filterValue 
   */
  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
