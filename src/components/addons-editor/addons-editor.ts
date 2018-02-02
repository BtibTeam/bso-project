// Angular
import { Component, Input, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// Material Angular
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

// Models
import { Addon } from '../../model/addon-model';
import { Tag } from '../../model/tag-model';

// Providers
import { AddonsDataProvider } from '../../providers/addons-data/addons-data';

@Component({
  selector: 'addons-editor',
  templateUrl: 'addons-editor.html'
})
export class AddonsEditor implements OnInit {

  private editAddon: Addon; // Edited Addon. For further use
  private type: string; // Might be 'tags' or 'relations'

  // Angular table
  public text: string;
  public displayedColumns = ['tag', 'kind', 'description', 'actions'];
  public dataSource = new MatTableDataSource();

  private editForm: any;
  private segment: string = 'tags';

  constructor(
    public addonsDataPvd: AddonsDataProvider,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddonsEditor>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.editAddon = data.addon;
    this.type = data.type;

  }

  ////////////////////////////////////////////////////////////////
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  ngOnInit(): void {

    if (this.type === 'tags') {
      this.addonsDataPvd.loadTags();
      this.addonsDataPvd.tags$.subscribe(tags => {
        this.dataSource = new MatTableDataSource(tags);
      });
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////

  /**
   * The user selected a addon
   * Close the the popup
   * @param addon 
   */
  public selectAddOn(addon: Addon): void {

    this.dialogRef.close({
      addon: addon
    });

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



}
