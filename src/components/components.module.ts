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
import { AddonsManager } from './addons-manager/addons-manager';
import { AddonsEditor } from './addons-editor/addons-editor';
import { NodeGroupEditor } from './node-group-editor/node-group-editor';
import { RelationManager } from './relation-manager/relation-manager';
import { NodeSelectorList } from './node-selector-list/node-selector-list';
import { TranslationManager } from './translation-manager/translation-manager';
import { TranslationEditor } from './translation-editor/translation-editor';

// Directives
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
	declarations: [
		AddonsManager,
		AddonsEditor,
		RelationManager,
		NodeSelectorList,
		NodeGroupEditor,
		TranslationManager,
		TranslationEditor
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
		NodeSelectorList,
		TranslationEditor
	],
	exports: [
		AddonsManager,
		AddonsEditor,
		RelationManager,
		NodeSelectorList,
		NodeGroupEditor,
		TranslationManager,
		TranslationEditor
	]
})
export class ComponentsModule { }
