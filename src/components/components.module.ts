// Framework
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Components
import { NodeEditor } from './node-editor/node-editor';
import { AddonsManager } from './addons-manager/addons-manager';
import { AddonsEditor } from './addons-editor/addons-editor';

// Directives
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
	declarations: [
		NodeEditor,
		AddonsManager,
		AddonsEditor
	],
	imports: [
		IonicModule,
		DirectivesModule,
		MatFormFieldModule,
		MatTableModule,
		MatInputModule,
		MatDialogModule,
		MatCheckboxModule
	],
	entryComponents: [
		AddonsEditor,
	],
	exports: [
		NodeEditor,
		AddonsManager,
		AddonsEditor
	]
})
export class ComponentsModule { }
