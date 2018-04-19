// Angular
import { NgModule } from '@angular/core';

// Angular Material
import { MatSelectModule } from '@angular/material/select';

// Components
import { ComponentsModule } from '../../components/components.module';

// Ionic
import { IonicPageModule } from 'ionic-angular';

// Page
import { CreateRequestPage } from './create-request';

@NgModule({
  declarations: [
    CreateRequestPage,
  ],
  imports: [
    MatSelectModule,
    ComponentsModule,
    IonicPageModule.forChild(CreateRequestPage),
  ],
})

export class CreateRequestPageModule { }
