// Framework
import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// Ionic
import { AlertController, IonicPage, ViewController, NavParams } from 'ionic-angular';

// Models
import { Node, NodeSnapshot, NodeTranslation } from '../../model/node-model';
import { Tag } from '../../model/tag-model';
import { Relation } from '../../model/relation-model';
import { NodeGroup } from '../../model/node-group-model';

@IonicPage()
@Component({
  selector: 'page-node-editor',
  templateUrl: 'node-editor.html'
})
export class NodeEditorPage {

  // Input values
  private originalNode: Node; // The original node
  private node: Node = new Node(); // The copy of the node to work on
  private readonly: boolean = false;
  
  private editForm: any;
  private segment: string = 'nodeRelations';

  constructor(
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private params: NavParams,
  ) {

    this.originalNode = this.params.get('node');
    this.readonly = this.params.get('readonly');

    this.editForm = formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(2), Validators.required])],
    });

    this.init(this.originalNode);

  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Cancel the Node edition 
   */
  protected cancel(): void {
    this.viewCtrl.dismiss();
  }

  /**
   * Delete the node from the database
   */
  protected deleteNode(): void {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure to delete the node?',
      message: 'The node will be definitely deleted and all its properties',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.viewCtrl.dismiss();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let data = { delete: true };
            this.viewCtrl.dismiss({ 'delete': this.node });
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * Save the node in the database
   */
  protected saveNode(): void {
    if (!this.editForm.valid) {
      console.error(this.editForm.value);
    } else {
      this.node.name = this.editForm.value.name;
      this.node.description = this.editForm.value.description;
      let map: Map<string, Node> = new Map();
      map.set('original', this.originalNode);
      map.set('modified', this.node);
      this.viewCtrl.dismiss({ 'save': map });
    }
  }

  /**
   * Update tags when they have changed
   * @param tags 
   */
  protected updateTags(tags: Tag[]): void {
    this.node.tags = tags;
  }

  /**
 * Update relations when they have changed
 * @param tags 
 */
  protected updateRelations(relations: Relation[]): void {
    this.node.relations = relations;
  }

  /**
   * Update has relations when the node is NodeGroup
   * @param has
   */
  protected updateGroups(has: NodeSnapshot[]): void {
    (this.node as NodeGroup).has = has;
  }

  /**
   * Update translations when they have changed
   * @param translations
   */
  protected updateTranslations(translations: NodeTranslation[]): void {
    this.node.translations = translations;
  }

  ////////////////////////////////////////////////////////////////
  // Utils
  ////////////////////////////////////////////////////////////////

  /**
   * Initialize the provided Node
   * @param changes
   */
  private init(_node: any): void {

    // Create a deep copy of the node
    this.node = Node.deepCopy(_node);

    // Patch form values
    this.editForm.patchValue({
      'name': this.node.name,
      'description': this.node.description
    });

  }

}
