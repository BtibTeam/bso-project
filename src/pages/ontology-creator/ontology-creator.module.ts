// Framework
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Angular Material
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { ComponentsModule } from '../../components/components.module';

// Pages
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
    PipesModule,
    MatTooltipModule
  ],
})
export class OntologyCreatorPageModule { }
