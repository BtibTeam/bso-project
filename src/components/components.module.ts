// Framework
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

// Components
import { NodeEditor } from './node-editor/node-editor';
import { AddonsManager } from './addons-manager/addons-manager';
import { AddonsEditor } from './addons-editor/addons-editor';

// Directives
import { DirectivesModule } from '../directives/directives.module';
import { RelationManager } from './relation-manager/relation-manager';
import { NodeSelectorList } from './node-selector-list/node-selector-list';

@NgModule({
	declarations: [
		NodeEditor,
		AddonsManager,
		AddonsEditor,
		RelationManager,
		NodeSelectorList
	],
	imports: [
		IonicModule,
		DirectivesModule,
		MatFormFieldModule,
		MatTableModule,
		MatInputModule,
		MatDialogModule,
		MatCheckboxModule,
		MatChipsModule,
		MatIconModule
	],
	entryComponents: [
		AddonsEditor,
		NodeSelectorList
	],
	exports: [
		NodeEditor,
		AddonsManager,
		AddonsEditor,
		RelationManager,
		NodeSelectorList
	]
})
export class ComponentsModule { }
