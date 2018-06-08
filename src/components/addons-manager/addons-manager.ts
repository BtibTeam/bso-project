// Angular
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

// Angular Material
import { MatTableDataSource, MatDialog } from '@angular/material';

// Components
import { AddonsEditor } from '../addons-editor/addons-editor';

// Models
import { Addon } from '../../model/addon-model';
import { Tag } from '../../model/tag-model';

@Component({
  selector: 'addons-manager',
  templateUrl: 'addons-manager.html'
})
export class AddonsManager implements OnInit {

  // Output events
  @Output() private onChange: EventEmitter<AddOnChange> = new EventEmitter<AddOnChange>();

  // Input values
  @Input('originalAddons') private originalAddons: Addon[];
  @Input('type') private type: string;
  @Input('readonly') private readonly: boolean = true;

  // Internal variables
  private addons: Addon[];
  private text: string;
  public displayedColumns = ['tag', 'kind', 'description', 'actions'];
  public dataSource = new MatTableDataSource();

  constructor(
    private dialog: MatDialog
  ) { }


  ////////////////////////////////////////////////////////////////
  // Life Cycles
  ////////////////////////////////////////////////////////////////

  public ngOnInit(): void {
    this.addons = JSON.parse(JSON.stringify(this.originalAddons));
    this.dataSource = new MatTableDataSource(this.addons);
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
   * Delete the given addon
   * @param addon 
   */
  public deleteAddOn(addon: Addon): void {
    const index = this.addons.indexOf(addon);
    if (index > -1) {
      this.addons.splice(index, 1);
      this.refreshTableDataSource();
    }
  }

  /**
   * Opens up a popup to select a tag among the database list
   * @param addon 
   */
  public addAddOn(): void {
    let dialogRef = this.dialog.open(AddonsEditor, {
      width: '800px',
      data: {
        type: this.type
      }
    });

    // Retrieve the selected addon if there is one
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addons.push(result.addon);
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
    this.onChange.emit({
      originalAddOns: this.originalAddons,
      newAddOns: this.addons
    });
    this.dataSource = new MatTableDataSource(this.addons);
  }
}

export interface AddOnChange {
  originalAddOns: Addon[],
  newAddOns: Addon[]
}
