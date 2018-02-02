// Angular
import { NgModule } from '@angular/core';

// Directives
import { TextareaAutogrowDirective } from './textarea-autogrow/textarea-autogrow';

@NgModule({
	declarations: [
		TextareaAutogrowDirective
	],
	imports: [],
	exports: [
		TextareaAutogrowDirective
	]
})
export class DirectivesModule { }
