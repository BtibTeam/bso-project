// Angular
import { Component, ViewChild, OnInit } from '@angular/core';

// Components
import { NodeEditor } from '../../components/node-editor/node-editor';

// Ionic
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';

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
export class OntologyCreatorPage implements OnInit {

  public topNodeDefList: string[] = ListUtil.buildTopNodeDefinitionList();
  public topNodeDef: string = 'category';
  public topNodeDefTreeIndex: number = 0;

  public nodeDefinitions: NodeDefinition[] = []; // UI list that can be manipulated

  public selectedNode: Node;

  public loading: Loading;

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
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  ngOnInit(): void {

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
  public topNodeDefChange(selection: string): void {
    this.topNodeDefTreeIndex = ListUtil.getTopNodeDefTreeIndex(selection);
  }

  /**
   * Reduce the list of displayed nodes depending on the given input
   * @param input 
   */
  public filterNodes(ev: any, list: NodeDefinitionList): void {
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
  public selectNode(node: Node, treeIndex: number): void {

    this.nodeHandlerPvd.setNodeDefinitions(this.nodeDefinitions);

    if (node.isSelected) {

      node.isSelected = false;
      this.nodeHandlerPvd.unselectNode(node, treeIndex);

    } else {

      node.isSelected = true;
      this.nodeHandlerPvd.selectNode(node, treeIndex);
    }

    this.selectedNode = node;

  }

  /**
   * Add a new node
   * @param nodeDefinitionIndex 
   * @param listIndex 
   */
  public addNode(nodeDefIndex: number, listIndex: number): void {
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

  /**
   * Update node data
   * @param node 
   */
  public updateNode(node): void {
    this.nodeDataPvd.updateNode(node);
  }

  /**
   * Delete node from the database
   * At this point, we already got the confirmation from the user
   * @param node 
   */
  public deleteNode(node): void {
    this.nodeDataPvd.deleteNode(node);
  }

  public cancelEditNode(node): void {
    // TODO: What do we do ?
  }

  addList(nodeDefinition: NodeDefinition) {
    nodeDefinition.lists.push(new NodeDefinitionList());
  }

  ////////////////////////////////////////////////////////////////
  // Private methods
  ////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////
  // Utils
  ////////////////////////////////////////////////////////////////

  /**
   * Return a Loading Ctrl
   * @param message
   * @return the created loading controller
   */
  private createLoadingCtrl(message: string): any {
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
  private handleTimeout(timeout: number, error?: string): void {
    setTimeout(() => {
      if (this.loading) {
        this.loading.dismiss()
        ViewUtil.presentToast(this.toastCtrl, error + 'Timeout. Error 1000');
      }
    }, timeout)
  }

}
