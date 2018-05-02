// Angular
import { Directive, Renderer } from '@angular/core';

// Ionic
import { DomController } from 'ionic-angular';

/**
 * Resize automatically the height of the text-area
 * TODO: Handle the text area height when lines are removed
 */
@Directive({
  selector: '[textarea-autogrow]', // Attribute selector
  host: {
    '(input)': 'resize($event.target)'
  }
})
export class TextareaAutogrowDirective {

  constructor(
    private renderer: Renderer,
    private domCtrl: DomController) {
  }

  ////////////////////////////////////////////////////////////////
  // Public Methods
  ////////////////////////////////////////////////////////////////

  public resize(textarea): void {

    let newHeight;

    this.domCtrl.read(() => {
      newHeight = textarea.scrollHeight;
    });

    this.domCtrl.write(() => {
      this.renderer.setElementStyle(textarea, 'height', newHeight + 'px');
    });

  }

}
