// Framework
import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// Ionic
import { AlertController } from 'ionic-angular';

// Models
import { Node, NodeSnapshot, NodeTranslation } from '../../model/node-model';
import { Tag } from '../../model/tag-model';
import { Relation } from '../../model/relation-model';
import { NodeGroup } from '../../model/node-group-model';

@Component({
  selector: 'node-editor',
  templateUrl: 'node-editor.html'
})
export class NodeEditor implements OnChanges {

  // Output events
  @Output() private onDelete: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() private onSave: EventEmitter<Map<string, Node>> = new EventEmitter<Map<string, Node>>();
  @Output() private onCancel: EventEmitter<Node> = new EventEmitter<Node>();

  // Input values
  @Input('node') private originalNode: Node;

  private node: Node = new Node(); // The copy of the node to work on

  private editForm: any;
  private segment: string = 'nodeRelations';

  constructor(
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
  ) {

    this.editForm = formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      description: ['', Validators.compose([Validators.minLength(2), Validators.required])],
    });

  }

  ////////////////////////////////////////////////////////////////
  // Life Cycles
  ////////////////////////////////////////////////////////////////

  public ngOnChanges(changes): void {
    if (changes.originalNode) {
      if (changes.originalNode.currentValue) {

        // Create a deep copy of the node
        this.node = Node.deepCopy(changes.originalNode.currentValue);

        // Patch form values
        this.editForm.patchValue({
          'name': this.node.name,
          'description': this.node.description
        });

      }
    }
  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

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
            //do nothing
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let data = { delete: true };
            this.onDelete.emit(this.node);
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
      this.onSave.emit(map);
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

}
