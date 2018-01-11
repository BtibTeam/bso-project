//Framework
import { NgModule } from '@angular/core';

//Pipes
import { FriendlyCasePipe } from './friendly-case/friendly-case';

@NgModule({
	declarations: [
		FriendlyCasePipe],
	imports: [],
	exports: [
		FriendlyCasePipe]
})
export class PipesModule { }
