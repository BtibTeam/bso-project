// Framework
import { Component } from '@angular/core';

// Models
import { Node } from '../../model/node-model';

@Component({
  selector: 'node-editor',
  templateUrl: 'node-editor.html'
})
export class NodeEditor {

  node: Node;

  constructor() {

  }

  ////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////

  setNode(node: Node) {
    // TODO: Handle more logics here to warn the user when a modification has not been saved
    this.node = node;
  }

}
