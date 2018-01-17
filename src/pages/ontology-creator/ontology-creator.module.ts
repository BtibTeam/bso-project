// Framework
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ComponentsModule } from '../../components/components.module';

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
    ComponentsModule,
    PipesModule
  ],
})
export class OntologyCreatorPageModule { }
