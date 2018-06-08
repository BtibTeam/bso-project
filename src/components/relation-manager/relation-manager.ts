// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';

// Angular Material
import { MatTableDataSource, MatDialog } from '@angular/material';

// Components
import { NodeSelectorList } from '../node-selector-list/node-selector-list';

// Models
import { Node, NodeSnapshot } from '../../model/node-model';
import { NodeDefinitionSnapshot } from '../../model/node-definition-model';
import { RelationChangeEnum } from '../../model/modification-request-model';

@Component({
  selector: 'relation-manager',
  templateUrl: 'relation-manager.html'
})
export class RelationManager {

  // Input values
  @Input('nodes') private nodes: NodeSnapshot[] = [];
  @Input('nodeDefs') private nodeDefs: NodeDefinitionSnapshot[] = [];
  @Input('showOnlySameTree') private showOnlySameTree: boolean = false;
  @Input('showNodeDef') private showNodeDef: boolean = false;
  @Input('onlyAscendantNodes') private onlyAscendantNodes: boolean = false;
  @Input('treeIndex') private treeIndex: number = -1;
  @Input('nodeDefIndex') private nodeDefIndex: number = -1;
  @Input('listIndex') private listIndex: number = -1;
  @Input('readonly') private readonly: boolean = true;

  // Outputs
  @Output() relationChanged: EventEmitter<RelationChange> = new EventEmitter<RelationChange>()

  // Internal variables
  private removable: boolean = true; // Whether chips can be removed

  constructor(
    private dialog: MatDialog
  ) {

  }

  ////////////////////////////////////////////////////////////////
  // User Interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Called a chip is removed
   * Remove the isIn relation with the targeted node
   * @param nodeSnap
   */
  protected removeNodeRelation(nodeSnap: NodeSnapshot): void {
    const index = this.nodes.indexOf(nodeSnap);
    if (index > -1) {
      this.nodes.splice(index, 1);
      this.relationChanged.emit({
        change: RelationChangeEnum.deleteRelation,
        entityName: nodeSnap.name
      });
    }
  }

  /**
   * Called a chip is removed
   * Remove the isIn relation with the targeted nodeDefinition
   * @param nodeDefSnap
   */
  protected removeNodeDefRelation(nodeDefSnap: NodeDefinitionSnapshot): void {
    const index = this.nodeDefs.indexOf(nodeDefSnap);
    if (index > -1) {
      this.nodeDefs.splice(index, 1);
      this.relationChanged.emit({
        change: RelationChangeEnum.deleteRelation,
        entityName: nodeDefSnap.name
      });
    }
  }

  /**
   * Called when a chip is added
   * Open a popup to display all possible nodes to be isIn related to
   * Add a new isIn relation to the selected node
   */
  protected addRelation(): void {
    let dialogRef = this.dialog.open(NodeSelectorList, {
      width: '800px',
      data: {
        nodes: this.nodes,
        showOnlySameTree: this.showOnlySameTree,
        showNodeDef: this.showNodeDef,
        onlyAscendantNodes: this.onlyAscendantNodes,
        treeIndex: this.treeIndex,
        nodeDefIndex: this.nodeDefIndex,
        listIndex: this.listIndex
      }
    });

    // Retrieve the selected addon if there is one
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let name: string = '';
        if (result.node) {
          this.nodes.push(NodeSnapshot.generateSnapshot(result.node));
          name = result.node.name;
        } else if (result.nodeDef) {
          this.nodeDefs.push(NodeDefinitionSnapshot.generateSnapshot(result.nodeDef));
          name = result.node.name;
        }
        this.relationChanged.emit({
          change: RelationChangeEnum.addRelation,
          entityName: name
        });
      }
    });
  }

}

export interface RelationChange {
  change: RelationChangeEnum,
  entityName: string,
}
