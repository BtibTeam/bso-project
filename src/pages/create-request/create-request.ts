// Angular
import { Component, EventEmitter } from '@angular/core';

// Ionic
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

// Models
import { ModificationRequest } from '../../model/modification-request-model';
import { MatSelectChange } from '@angular/material';

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
    private viewCtrl: ViewController
  ) {
    this.node = navParams.get('node');
  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Ask the user which new language he would like to translate to
   * Filter the event.value to trigger it only if it concerns a new language
   * @param event
   */
  protected defineNewTranslation(event: any): void {
    if (event.value === NEW_TRANSLATION) {
      var confirm = this.alertCtrl.create({
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
   * Cancel the Node edition 
   */
  protected cancel(): void {
    this.viewCtrl.dismiss();
  }







}
