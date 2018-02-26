// Angular
import { Component, OnInit, Input, Inject, OnChanges } from '@angular/core';

// Angular Material
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Models
import { NodeDefinition } from '../../model/node-definition-model';
import { Node, NodeSnapshot } from '../../model/node-model';

// Providers
import { NodeHandlerProvider } from '../../providers/node-handler/node-handler';
import { NodeDataProvider } from '../../providers/node-data/node-data';

@Component({
  selector: 'node-selector-list',
  templateUrl: 'node-selector-list.html'
})
export class NodeSelectorList implements OnInit {

  // Input values
  private showOnlySameTree: boolean = false;
  private showNodeDef: boolean = false;
  private onlyAscendantNodes: boolean = false;
  private nodes: NodeSnapshot[] = [];
  private treeIndex: number = -1;
  private nodeDefIndex: number = -1;
  private listIndex: number = -1;

  private segment: string = 'nodes';

  // Angular Table
  private text: string;
  public nodeDisplayedColumns = ['name', 'description', 'actions'];
  public nodeDefinitionDisplayedColumns = ['name', 'actions'];
  public nodeDataSource = new MatTableDataSource();
  public nodeDefinitionDataSource = new MatTableDataSource();

  constructor(
    private nodePvd: NodeHandlerProvider,
    private nodeDataPvd: NodeDataProvider,
    public dialogRef: MatDialogRef<NodeSelectorList>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.showOnlySameTree = data.showOnlySameTree;
    this.showNodeDef = data.showNodeDef;
    this.onlyAscendantNodes = data.onlyAscendantNodes;
    this.nodes = data.nodes;
    this.treeIndex = data.treeIndex;
    this.nodeDefIndex = data.nodeDefIndex;
    this.listIndex = data.listIndex;
  }

  ////////////////////////////////////////////////////////////////
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  public ngOnInit(): void {

    // Get all nodes from the NodeData provider and then update the internal list of nodes
    this.nodeDataPvd.loadNodeDefinitions();
    this.nodeDataPvd.nodeDefinitions$.subscribe(nodeDefinitions => {

      let nodes: Node[] = [];
      let nodeDefs: NodeDefinition[] = [];

      for (let nodeDef of nodeDefinitions) {

        if (nodeDef.treeIndex != this.treeIndex) {
          if (this.showOnlySameTree === false) {
            continue;
          }
        }

        nodeDefs.push(nodeDef);

        nodeDef.lists.forEach(list => {

          nodes = nodes.concat(list.nodes);

          // Remove unwanted nodes only if we want to display the ones of the tree index
          if (this.onlyAscendantNodes === true) {

            // Remove nodes that would be a list at the same level or below
            nodes = nodes.filter(node => {
              return node.nodeDefIndex < this.nodeDefIndex || node.nodeDefIndex === this.nodeDefIndex && node.listIndex < this.listIndex;
            });

            // Remove nodes already related to the current node
            nodes = nodes.filter(node => {
              return !!this.nodes.findIndex(nodeSnap => (node.id === nodeSnap.id))
            });
          }

        });

        this.nodeDataSource = new MatTableDataSource(nodes);
        this.nodeDefinitionDataSource = new MatTableDataSource(nodeDefs);
      }

    });

  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  ////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////

  /**
   * The user selected a node
   * Close the popup
   * @param node 
   */
  public selectNode(node: Node): void {

    this.dialogRef.close({
      node: node
    });

  }

  /**
   * The user selected a nodeDefinition
   * Close the popup
   * @param nodeDef
   */
  public selectNodeDef(nodeDef: Node): void {

    this.dialogRef.close({
      nodeDef: nodeDef
    });

  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Handle search bar value
   * @param filterValue 
   */
  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.nodeDataSource.filter = filterValue;
  }

}
