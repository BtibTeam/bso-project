// Angular
import { Component, EventEmitter } from '@angular/core';

// Angular Material
import { MatSelectChange } from '@angular/material';

// Ionic
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

// Models
import { Node } from '../../model/node-model';
import { ModificationRequest, RelationChangeEnum, RequestSubjectEnum } from '../../model/modification-request-model';
import { RelationChange } from '../../components/relation-manager/relation-manager';
import { Addon } from '../../model/addon-model';
import { AddOnChange } from '../../components/addons-manager/addons-manager';

// Providers
import { ModificationRequestProvider } from '../../providers/modification-request/modification-request';

// Constants
const NEW_TRANSLATION: string = 'new';

@IonicPage()
@Component({
  selector: 'page-create-request',
  templateUrl: 'create-request.html',
})
export class CreateRequestPage {

  private node: Node = null;
  private request: ModificationRequest = new ModificationRequest();

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private modificationRequestPvd: ModificationRequestProvider
  ) {
    this.node = navParams.get('node');
  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Called when relations of a node are changed
   */
  protected changeNodeRelations(event: RelationChange, relation: string): void {
    if (event.change === RelationChangeEnum.addRelation) {
      this.request.value1 = 'add relation';
    } else if (event.change === RelationChangeEnum.deleteRelation) {
      this.request.value1 = 'delete relation';
    }
    this.request.value2 = event.entityName;
  }

  /**
   * Called when source tags of a node are changed
   * @param event 
   */
  protected changeAddons(event: AddOnChange, field: string): void {
    this.request.field = field;
    // Fill the old list of tags or relations in value 1
    this.request.value1 = '';
    event.originalAddOns.forEach(addon => {
      this.request.value1 += addon.id + '+';
    });
    // Remove the last +
    if (this.request.value1.length > 0) {
      this.request.value1 = this.request.value1.substring(0, this.request.value1.length - 1);
    }

    // Fill the new list of tags or relations in value 2
    event.newAddOns.forEach(addon => {
      this.request.value2 += addon.id + '+';
    });
    // Remove the last +
    if (this.request.value2.length > 0) {
      this.request.value2 = this.request.value2.substring(0, this.request.value2.length - 1);
    }

  }

  /**
   * Ask the user which new language he would like to translate to
   * Filter the event.value to trigger it only if it concerns a new language
   * @param event
   */
  protected defineNewTranslation(event: any): void {
    if (event.value === NEW_TRANSLATION) {
      let confirm = this.alertCtrl.create({
        message: 'Please define the languge by its code composed of two letters (en, fe, es etc.)',
        inputs: [
          {
            name: 'code',
          }
        ],
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Ok',
            handler: data => {
              this.request.newLanguage = true;
              this.request.language = data.code + '';
            }
          }
        ]
      });
      confirm.present();
    }
  }

  /**
   * Delete the new translation
   */
  protected deleteNewTranslation(): void {
    this.request.newLanguage = false;
    this.request.language = 'en';
  }

  /**
   * Send the modification request to the database
   */
  protected validateRequest(): void {
    this.request.originalNodeId = this.node.id;
    this.request.originalNodeName = this.node.name;
    this.modificationRequestPvd.createModificationRequest(this.request).then(() => {
      // Display a popup to thank the user
      let confirm = this.alertCtrl.create({
        title: 'Request submitted',
        message: 'Thank you for your contribution',
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.viewCtrl.dismiss();
            }
          }
        ]
      });
      confirm.present();
    });
  }

  /**
   * Cancel the Node edition 
   */
  protected cancel(): void {
    this.viewCtrl.dismiss();
  }








}
