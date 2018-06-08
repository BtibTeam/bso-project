// Angular
import { NgModule } from '@angular/core';

// Ionic
import { IonicPageModule } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';

// Pages
import { ManageRequestsPage } from './manage-requests';

// Providers
import { ModificationRequestProvider } from '../../providers/modification-request/modification-request';

@NgModule({
  declarations: [
    ManageRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageRequestsPage),
    IonicModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    ModificationRequestProvider
  ]
})
export class ManageRequestsPageModule { }
