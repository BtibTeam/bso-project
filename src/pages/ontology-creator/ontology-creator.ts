// Angular
import { Component, ViewChild, OnInit } from '@angular/core';

// Ionic
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController, ModalController } from 'ionic-angular';

// Models
import { Node, NodeSnapshot } from '../../model/node-model';
import { NodeDefinition, NodeDefinitionList } from '../../model/node-definition-model';
import { Config } from '../../model/config-model';

// Providers
import { NodeHandlerProvider } from '../../providers/node-handler/node-handler';
import { NodeDataProvider } from '../../providers/node-data/node-data';
import { ConfigProvider } from '../../providers/config/config';

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

  private topNodeDefList: string[] = ListUtil.buildTopNodeDefinitionList();
  private topNodeDef: string = 'category';
  private topNodeDefTreeIndex: number = 0;

  private nodeDefinitions: NodeDefinition[] = []; // UI list that can be manipulated
  private config: Config = new Config(); // Config object
  private lastPublicationText: string = '';

  private loading: Loading;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private nodeHandlerPvd: NodeHandlerProvider,
    private configPvd: ConfigProvider,
    private nodeDataPvd: NodeDataProvider) {
  }

  ////////////////////////////////////////////////////////////////
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  public ngOnInit(): void {

    this.nodeDataPvd.loadNodeDefinitions();
    this.nodeDataPvd.nodeDefinitions$.subscribe(nodeDefinitions => {
      this.nodeDefinitions = nodeDefinitions;

      this.nodeHandlerPvd.setNodeDefinitions(this.nodeDefinitions);

    });

  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Update the topNodeDefTreeIndex based on the user selection of the top nodeNodeDefinition
   */
  protected topNodeDefChange(segment: any): void {
    this.topNodeDefTreeIndex = ListUtil.getTopNodeDefTreeIndex(segment.value);
  }

  /**
   * Reduce the list of displayed nodes depending on the given input
   * @param input 
   */
  protected filterNodes(ev: any, list: NodeDefinitionList): void {
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      for (let node of list.nodes) {
        node.isFilteredOut = node.name.toLowerCase().indexOf(val.toLowerCase()) === -1;
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
  protected selectNode(node: Node, treeIndex: number): void {

    if (node.isSelected) {

      node.isSelected = false;
      this.nodeHandlerPvd.unselectNode(node, treeIndex);
      let targetedNode = this.nodeHandlerPvd.getSelectedParentNode(node);

    } else {

      node.isSelected = true;
      this.nodeHandlerPvd.selectNode(node, treeIndex);
    }

  }

  /**
   * Open a modal with the Node Editor
   * @param node 
   * @param treeIndex 
   */
  protected editNode(node: Node, treeIndex: number) {

    let nodeEditorModal = this.modalCtrl.create('NodeEditorPage', { node });
    nodeEditorModal.present();
    nodeEditorModal.onDidDismiss(data => {
      if (data) {
        if (data.delete) {
          this.deleteNode(data.delete);
        } else if (data.save) {
          this.updateNode(data.save);
        }
      }
    });

  }

  /**
   * Add a new node
   * @param nodeDefinitionIndex 
   * @param listIndex 
   */
  protected addNode(nodeDefIndex: number, listIndex: number, isNodeGroupDefinition: boolean): void {
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
            this.nodeDataPvd.createNode(data.name, this.topNodeDefTreeIndex, nodeDefIndex, listIndex, isNodeGroupDefinition).then(() => {
              this.loading.dismiss();
              this.loading = null;
              this.nodeHandlerPvd.unselectAllNodes();
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
  protected updateNode(map: Map<string, Node>): void {
    this.nodeDataPvd.synchronizeNode(map);
    this.nodeHandlerPvd.unselectAllNodes();
  }

  /**
   * Delete node from the database
   * At this point, we already got the confirmation from the user
   * @param node 
   */
  protected deleteNode(node): void {
    this.nodeDataPvd.deleteNode(node);
    this.nodeHandlerPvd.unselectAllNodes();
  }

  /**
   * Cancel the edition of the node
   * @param node
   */
  protected cancelEditNode(node): void {
    // TODO: What do we do ?
  }

  /**
   * Add a new list
   * @param nodeDefinition
   */
  protected addList(nodeDefinition: NodeDefinition) {
    nodeDefinition.lists.push(new NodeDefinitionList());
  }

  /**
   * Publish a new version 
   */
  protected publishNewVersion() {

    // Present an alert to the user to get the name of the node to create
    let alert = this.alertCtrl.create({
      title: 'Publish a new version',
      subTitle: 'Current version: ' + this.config.version,
      inputs: [
        {
          name: 'version',
          placeholder: 'Increment the current version'
        },
        {
          name: 'changelog',
          placeholder: 'Specify a changelog'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Publish',
          handler: data => {

            this.loading = this.createLoadingCtrl('Publishing the new version');
            this.handleTimeout(10000, 'Publishing the new version');
            this.loading.present();

            this.config.version = data.version;
            this.config.lastPublication = Date.now();
            this.config.changelog.splice(0, 1, {
              version: this.config.version,
              date: this.config.lastPublication,
              text: data.changelog
            });

            // Create the node in the database and update the related node
            this.configPvd.updateVersion(this.config).then(() => {
              this.loading.dismiss();
              this.loading = null;
              this.nodeHandlerPvd.unselectAllNodes();
            });
          }
        }
      ]
    });
    alert.present();

  }

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
