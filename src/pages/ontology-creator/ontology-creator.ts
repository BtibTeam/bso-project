// Framework
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Models
import { Node, NodeSnapshot } from '../../model/node-model';
import { NodeDefinition, NodeDefinitionList } from '../../model/node-definition-model';

// Providers
import { NodeHandlerProvider } from '../../providers/node-handler/node-handler';
import { NodeDataProvider } from '../../providers/node-data/node-data';

// RxJs
import { Observable } from 'rxjs/Observable';

// Utils
import { ListUtil } from '../../utils/list-util';

@IonicPage()
@Component({
  selector: 'page-ontology-creator',
  templateUrl: 'ontology-creator.html',
})
export class OntologyCreatorPage {

  topNodeDefList: string[] = ListUtil.buildTopNodeDefinitionList();
  topNodeDef: string = 'category';
  topNodeDefTreeIndex: number = 0;

  nodeDefinitions: NodeDefinition[] = []; // UI list that can be manipulated

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nodeHandlerPvd: NodeHandlerProvider,
    public nodeDataPvd: NodeDataProvider) {
  }

  ////////////////////////////////////////////////////////////////
  // Framework
  ////////////////////////////////////////////////////////////////

  ngOnInit() {

    this.nodeDataPvd.generateFakeNodes().subscribe(nodeDefinitions => {
      this.nodeDefinitions = nodeDefinitions;
    });

  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Update the topNodeDefTreeIndex based on the user selection of the top nodeNodeDefinition
   */
  topNodeDefChange(selection: string) {
    this.topNodeDefTreeIndex = ListUtil.getTopNodeDefTreeIndex(selection);
  }

  /**
   * Reduce the list of displayed nodes depending on the given input
   * @param input 
   */
  filterNodes(ev: any, list: NodeDefinitionList) {
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      for (let node of list.nodes) {
        node.isFilteredOut = node.name.toLowerCase().indexOf(val.toLowerCase()) == -1;
        console.log(node);
      }
    } else {
      for (let node of list.nodes) {
        node.isFilteredOut = false;
      }
    }
  }

  /**
   * Triggered when a user select a node in the list
   * @param node 
   * @param treeIndex 
   */
  selectNode(node: Node, treeIndex: number) {

    this.nodeHandlerPvd.setNodeDefinitions(this.nodeDefinitions);

    if (node.isSelected) {

      node.isSelected = false;
      this.nodeHandlerPvd.unselectNode(treeIndex);

    } else {

      node.isSelected = true;
      this.nodeHandlerPvd.selectNode(node, treeIndex);
    }

  }
}
