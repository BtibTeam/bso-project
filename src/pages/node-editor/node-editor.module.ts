// Framework
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ComponentsModule } from '../../components/components.module';

// Pages
import { NodeEditorPage } from './node-editor';

@NgModule({
  declarations: [
    NodeEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(NodeEditorPage),
    ComponentsModule,
  ],
})
export class NodeEditorPageModule { }
