// Angular
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// Angular Material
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Models
import { NodeTranslation } from '../../model/node-model';

@Component({
  selector: 'translation-editor',
  templateUrl: 'translation-editor.html'
})
export class TranslationEditor {

  private editForm: any;
  private originalName: string = '';
  private translation: NodeTranslation = new NodeTranslation();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TranslationEditor>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translation = data.translation;
    this.originalName = data.originalName;

    this.editForm = formBuilder.group({
      language: [this.translation.language, Validators.compose([Validators.minLength(1), Validators.required])],
      name: [this.translation.name, Validators.compose([Validators.minLength(1), Validators.required])],
      description: [this.translation.description, Validators.compose([Validators.minLength(1), Validators.required])],
    });

  }

  ////////////////////////////////////////////////////////////////
  // User Interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Save the node in the database
   */
  protected saveTranslation(): void {
    if (!this.editForm.valid) {
      console.error(this.editForm.value);
    } else {

      this.translation.language = this.editForm.value.language;
      this.translation.name = this.editForm.value.name;
      this.translation.description = this.editForm.value.description;

      this.dialogRef.close({
        translation: this.translation
      });

    }
  }

}
