// Framework
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Page
import { OntologyCreatorPage } from './ontology-creator';

// Pipes
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OntologyCreatorPage,
  ],
  imports: [
    IonicPageModule.forChild(OntologyCreatorPage),
    PipesModule
  ],
})
export class OntologyCreatorPageModule { }
