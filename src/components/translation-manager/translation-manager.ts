// Angular
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

// Angular Material
import { MatTableDataSource, MatDialog } from '@angular/material';

// Components
import { TranslationEditor } from '../translation-editor/translation-editor';

// Models
import { NodeTranslation } from '../../model/node-model';

@Component({
  selector: 'translation-manager',
  templateUrl: 'translation-manager.html'
})
export class TranslationManager implements OnChanges {

  // Output events
  @Output() private onChange: EventEmitter<NodeTranslation[]> = new EventEmitter<NodeTranslation[]>();

  // Input values
  @Input('originalName') private originalName: string = '';
  @Input('translations') private translations: NodeTranslation[];
  @Input('readonly') private readonly: boolean = true;
  
  public displayedColumns = ['language', 'name', 'description', 'actions'];
  public dataSource = new MatTableDataSource();

  constructor(
    private dialog: MatDialog
  ) { }


  ////////////////////////////////////////////////////////////////
  // Life Cycles
  ////////////////////////////////////////////////////////////////

  public ngOnChanges(changes): void {
    if (changes.translations) {
      if (changes.translations.currentValue) {
        this.dataSource = new MatTableDataSource(this.translations);
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Handle search bar value
   * @param filterValue 
   */
  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
   * Delete the given translation
   * @param translation 
   */
  public deleteTranslation(translation: NodeTranslation): void {
    const index = this.translations.indexOf(translation);
    if (index > -1) {
      this.translations.splice(index, 1);
      this.refreshTableDataSource();
    }
  }

  /**
   * Open up a popup to add a new translation
   * @param addon 
   */
  public addTranslation(): void {
    let dialogRef = this.dialog.open(TranslationEditor, {
      width: '800px',
      data: {
        originalName: this.originalName,
        translation: new NodeTranslation()
      }
    });

    // Retrieve the new translation if there is one
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.translations.push(result.translation);
        this.refreshTableDataSource();
      }
    });
  }

  /**
   * Open up a popup to edit the translation
   * @param translation 
   */
  public editTranslation(translation): void {
    const index = this.translations.indexOf(translation);
    let dialogRef = this.dialog.open(TranslationEditor, {
      width: '800px',
      data: {
        originalName: this.originalName,
        translation: translation
      }
    });

    // Retrieve the translation if there is one
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.translations[index] = result.translation;
        this.refreshTableDataSource();
      }
    });
  }

  ////////////////////////////////////////////////////////////////
  // Utils
  ////////////////////////////////////////////////////////////////

  /**
   * Refresh the DataTableSource
   */
  private refreshTableDataSource(): void {
    this.onChange.emit(this.translations);
    this.dataSource = new MatTableDataSource(this.translations);
  }
}

