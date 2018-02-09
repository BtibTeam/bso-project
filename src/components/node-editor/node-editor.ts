// Framework
import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';

// Models
import { Node } from '../../model/node-model';
import { Tag } from '../../model/tag-model';
import { Relation } from '../../model/relation-model';

@Component({
  selector: 'node-editor',
  templateUrl: 'node-editor.html'
})
export class NodeEditor implements OnChanges {

  // Output events
  @Output() onDelete: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() onSave: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() onCancel: EventEmitter<Node> = new EventEmitter<Node>();

  // Input values
  @Input('node') node: Node;

  private editForm: any;
  private segment: string = 'tags';

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

  ngOnChanges(changes): void {
    if (changes.node) {
      if (changes.node.currentValue) {

        // Create a deep copy of the node
        this.node = Node.deepCopy(changes.node.currentValue);

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
  public deleteNode(): void {
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
  public saveNode(): void {
    if (!this.editForm.valid) {
      console.error(this.editForm.value);
    } else {
      this.node.name = this.editForm.value.name;
      this.node.description = this.editForm.value.description;
      this.onSave.emit(this.node);
    }
  }

  /**
   * Update tags when they have changed
   * @param tags 
   */
  public updateTags(tags: Tag[]): void {
    this.node.tags = tags;
  }

  /**
 * Update relations when they have changed
 * @param tags 
 */
  public updateRelations(relations: Relation[]): void {
    this.node.relations = relations;
  }

}
