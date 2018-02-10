// Angular
import { Component, Input } from '@angular/core';

// Angular Material
import { MatTableDataSource, MatDialog } from '@angular/material';

// Components
import { NodeSelectorList } from '../node-selector-list/node-selector-list';

// Models
import { Node, NodeSnapshot } from '../../model/node-model';

@Component({
  selector: 'relation-manager',
  templateUrl: 'relation-manager.html'
})
export class RelationManager {

  // Input values
  @Input('isIn') private isIn: NodeSnapshot[] = [];
  @Input('nodeDefIndex') private nodeDefIndex: number = 0;
  @Input('listIndex') private listIndex: number = 0;

  private removable: boolean = true; // Whether chips can be removed

  constructor(
    private dialog: MatDialog
  ) {

  }

  ////////////////////////////////////////////////////////////////
  // Life Cycles
  ////////////////////////////////////////////////////////////////

  public ngOnChanges(changes): void {
    if (changes.isin) {
      if (changes.isIn.currentValue) {
        this.isIn = changes.isIn.currentValue;
      }
    } else if (changes.nodeDefIndex) {
      if (changes.isIn.nodeDefIndex) {
        this.nodeDefIndex = changes.nodeDefIndex.currentValue;
      }
    } else if (changes.listIndex) {
      if (changes.isIn.listIndex) {
        this.listIndex = changes.listIndex.currentValue;
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  // User Interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Called a chip is removed
   * Remove the isIn relation with the targeted node
   * @param nodeSnap
   */
  protected removeRelation(nodeSnap: NodeSnapshot): void {
    const index = this.isIn.indexOf(nodeSnap);
    if (index > -1) {
      this.isIn.splice(index, 1);
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
        isIn: this.isIn,
        nodeDefIndex: this.nodeDefIndex,
        listIndex: this.listIndex
      }
    });

    // Retrieve the selected addon if there is one
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isIn.push(NodeSnapshot.generateSnapshot(result.node));
      }
    });
  }



}
