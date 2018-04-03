// Angular
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

// Models
import { Node, NodeSnapshot } from '../../model/node-model';
import { NodeDefinition } from '../../model/node-definition-model';

// Providers
import { NodeDataProvider } from '../../providers/node-data/node-data';

@Component({
  selector: 'node-group-editor',
  templateUrl: 'node-group-editor.html'
})
export class NodeGroupEditor implements OnInit, OnChanges {

  // Output events
  @Output() private onChange: EventEmitter<NodeSnapshot[]> = new EventEmitter<NodeSnapshot[]>();

  // Input values
  @Input('has') private hasRelations: NodeSnapshot[] = [];
  @Input('readonly') private readonly: boolean = true;

  // Available nodes
  private positionNodes: Node[] = [];
  private resourceNodes: Node[] = [];
  private typeNodes: Node[] = [];
  private dimensionNodes: Node[] = [];
  private caracteristicNodes: Node[] = [];

  // Selected nodes
  private selectedPosition: NodeSnapshot = null;
  private selectedResource: NodeSnapshot = null;
  private selectedType: NodeSnapshot = null;
  private selectedDimension: NodeSnapshot = null;
  private selectedCaracteristic: NodeSnapshot = null;

  constructor(
    private nodeDataPvd: NodeDataProvider) {
  }

  ////////////////////////////////////////////////////////////////
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  public ngOnInit(): void {

    // Get all nodes from the NodeData provider and then update the internal list of nodes
    this.nodeDataPvd.loadNodeDefinitions();
    this.nodeDataPvd.nodeDefinitions$.subscribe(nodeDefinitions => {

      let nodes: Node[] = [];

      for (let nodeDef of nodeDefinitions) {

        switch (nodeDef.id) {
          case 'position':
            this.positionNodes = this.fillNodeArray(this.positionNodes, nodeDef);
            break;
          case 'resource':
            this.resourceNodes = this.fillNodeArray(this.resourceNodes, nodeDef);
            break;
          case 'type':
            this.typeNodes = this.fillNodeArray(this.typeNodes, nodeDef);
            break;
          case 'dimension':
            this.dimensionNodes = this.fillNodeArray(this.dimensionNodes, nodeDef);
            break;
          case 'caracteristic':
            this.caracteristicNodes = this.fillNodeArray(this.caracteristicNodes, nodeDef);
            break;
        }
      }
    });

  }

  public ngOnChanges(changes): void {
    if (changes.hasRelations) {
      if (changes.hasRelations.currentValue) {
        // Update the selected nodes
        for (let nodeSnap of this.hasRelations) {
          switch (nodeSnap.treeIndex) {
            case 1: // Position node
              this.selectedPosition = nodeSnap;
              break;
            case 2: // Resource
              this.selectedResource = nodeSnap;
              break;
            case 3: // Type
              this.selectedType = nodeSnap;
              break;
            case 4: // Dimension
              this.selectedDimension = nodeSnap;
              break;
            case 5: // Caracteristic
              this.selectedCaracteristic = nodeSnap;
              break;
          }
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  // User Interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Update the selected node when it is selected or unselected
   * @param node
   */
  protected selectNode(node: Node, nodeDefinitionId: string): void {
    if (this.readonly)
      return;

    switch (nodeDefinitionId) {
      case 'position':
        if (this.selectedPosition && this.selectedPosition.id === node.id) {
          this.selectedPosition = null;
        } else {
          this.selectedPosition = NodeSnapshot.generateSnapshot(node);
        }
        break;
      case 'resource':
        if (this.selectedResource && this.selectedResource.id === node.id) {
          this.selectedResource = null;
        } else {
          this.selectedResource = NodeSnapshot.generateSnapshot(node);
        }
        break;
      case 'type':
        if (this.selectedType && this.selectedType.id === node.id) {
          this.selectedType = null;
        } else {
          this.selectedType = NodeSnapshot.generateSnapshot(node);
        }
        break;
      case 'dimension':
        if (this.selectedDimension && this.selectedDimension.id === node.id) {
          this.selectedDimension = null;
        } else {
          this.selectedDimension = NodeSnapshot.generateSnapshot(node);
        }
        break;
      case 'caracteristic':
        if (this.selectedCaracteristic && this.selectedCaracteristic.id === node.id) {
          this.selectedCaracteristic = null;
        } else {
          this.selectedCaracteristic = NodeSnapshot.generateSnapshot(node);
        }
        break;
    }
    this.emitNewchanges();
  }

  ////////////////////////////////////////////////////////////////
  // Private Methods
  ////////////////////////////////////////////////////////////////

  /**
   * Take every node from the nodeDefinition and fill the given array
   * @param array 
   * @param nodeDef 
   */
  private fillNodeArray(array: Node[], nodeDef: NodeDefinition): Node[] {
    array = [];
    for (let list of nodeDef.lists) {
      array = array.concat(list.nodes);
    }
    return array;
  }

  /**
   * Emit new changes when a node is selected or unselected
   */
  private emitNewchanges(): void {
    let hasRelations: NodeSnapshot[] = [];
    if (this.selectedPosition != null) {
      hasRelations.push(this.selectedPosition);
    }
    if (this.selectedResource != null) {
      hasRelations.push(this.selectedResource);
    }
    if (this.selectedType != null) {
      hasRelations.push(this.selectedType);
    }
    if (this.selectedDimension != null) {
      hasRelations.push(this.selectedDimension);
    }
    if (this.selectedCaracteristic != null) {
      hasRelations.push(this.selectedCaracteristic);
    }
    this.onChange.emit(hasRelations);
  }
}
