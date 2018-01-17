// Framework
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';

// Components
import { NodeEditor } from '../../components/node-editor/node-editor';

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
import { ViewUtil } from '../../utils/view-util';

@IonicPage()
@Component({
  selector: 'page-ontology-creator',
  templateUrl: 'ontology-creator.html',
})
export class OntologyCreatorPage {

  @ViewChild(NodeEditor) nodeEditor: NodeEditor;

  topNodeDefList: string[] = ListUtil.buildTopNodeDefinitionList();
  topNodeDef: string = 'category';
  topNodeDefTreeIndex: number = 0;

  nodeDefinitions: NodeDefinition[] = []; // UI list that can be manipulated

  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public nodeHandlerPvd: NodeHandlerProvider,
    public nodeDataPvd: NodeDataProvider) {
  }

  ////////////////////////////////////////////////////////////////
  // Framework
  ////////////////////////////////////////////////////////////////

  ngOnInit() {

    /*this.nodeDataPvd.generateFakeNodes().subscribe(nodeDefinitions => {
      this.nodeDefinitions = nodeDefinitions;
    });*/
    this.nodeDataPvd.loadNodeDefinitions();
    this.nodeDataPvd.nodeDefinitions$.subscribe(nodeDefinitions => {
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
      this.nodeHandlerPvd.unselectNode(node, treeIndex);

    } else {

      node.isSelected = true;
      this.nodeHandlerPvd.selectNode(node, treeIndex);
    }

    this.editNode(node);

  }

  /**
   * Add a new node
   * @param nodeDefinitionIndex 
   * @param listIndex 
   */
  addNode(nodeDefIndex: number, listIndex: number) {
    // Present an alert to the user to get the name of the node to create
    let alert = this.alertCtrl.create({
      title: 'Add node',
      inputs: [
        {
          name: 'name',
          placeholder: 'Choose a succinct name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: data => {
            this.loading = this.createLoadingCtrl('Creating the node');
            this.handleTimeout(10000, 'Creating Node');
            this.loading.present();

            // Create the node in the database and update related node
            this.nodeDataPvd.createNode(data.name, nodeDefIndex, listIndex).then(() => {
              this.loading.dismiss();
              this.loading = null;
            });
          }
        }
      ]
    });
    alert.present();

  }

  addList(nodeDefinition: NodeDefinition) {
    nodeDefinition.lists.push(new NodeDefinitionList());
  }

  ////////////////////////////////////////////////////////////////
  // Private methods
  ////////////////////////////////////////////////////////////////

  editNode(node: Node) {
    this.nodeEditor.setNode(node);
  }

  ////////////////////////////////////////////////////////////////
  // Utils
  ////////////////////////////////////////////////////////////////

  /**
   * Return a Loading Ctrl
   * @param message 
   */
  createLoadingCtrl(message: string) {
    return this.loadingCtrl.create({
      content: message
    });
  }

  /**
   * Kill a displayed loading and display a message automatically if it takes too long
   * @param loading 
   * @param timeout 
   * @param error 
   */
  handleTimeout(timeout: number, error?: string) {
    setTimeout(() => {
      if (this.loading) {
        this.loading.dismiss()
        ViewUtil.presentToast(this.toastCtrl, error + 'Timeout. Error 1000');
      }
    }, timeout)
  }

}
