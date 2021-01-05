import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { LayerStorageService } from '../../services/layer-storage.service';

import { Layer } from '../../classes/layer';
import { SamplingPoint } from '../../classes/sampling-point';

@Component({
  selector: 'app-editor-table',
  templateUrl: './editor-table.component.html',
  styleUrls: ['./editor-table.component.css']
})
export class EditorTableComponent implements OnInit {

  constructor(private layerStorage: LayerStorageService) { }

  dataSource = new MatTableDataSource<SamplingPoint>();
  displayedColumns: string[];
  totalTablePages = 0;
  actualTablePage = 0;

  exhibitedUpperIndex = 0;
  isEditing = false;
  quantityExhibitedSP = 20;
  exhibitedLowerIndex = this.quantityExhibitedSP * -1;
  wasEdited = false;

  layer: Layer;

  ngOnInit(): void {
    this.layer = this.layerStorage.getOriginalLayer();
    this.displayedColumns = ['index', this.layer.header1, this.layer.header2, this.layer.header3];
    this.calculateTotalTablePages();
    this.tablePaginatorNextPage();
  }

  calculateTotalTablePages(): void {
    if ((this.layer.pointsQuantity % this.quantityExhibitedSP) === 0) {
      this.totalTablePages = (this.layer.pointsQuantity / this.quantityExhibitedSP);
    } else {
      this.totalTablePages = (this.layer.pointsQuantity - (this.layer.pointsQuantity % this.quantityExhibitedSP));
      this.totalTablePages = this.totalTablePages / this.quantityExhibitedSP;
      this.totalTablePages = this.totalTablePages + 1;
    }
  }

  tablePaginatorNextPage(): void {
    const exhibitedSP = [];
    let arraySize = this.quantityExhibitedSP;
    if ((this.exhibitedUpperIndex + this.quantityExhibitedSP) > this.layer.pointsQuantity) {
      arraySize = this.layer.pointsQuantity - this.exhibitedUpperIndex;
    }
    for (let i = 0; i < arraySize; i++) {
      exhibitedSP.push(this.layer.samplingPoints[this.exhibitedUpperIndex + i]);
    }
    this.dataSource.data = exhibitedSP;
    this.exhibitedUpperIndex = this.exhibitedUpperIndex + arraySize;
    this.exhibitedLowerIndex = this.exhibitedLowerIndex + this.quantityExhibitedSP;
    this.calculateActualTablePage();
  }

  calculateActualTablePage(): void {
    if (((this.layer.pointsQuantity % this.quantityExhibitedSP) === 0) || (this.layer.pointsQuantity !== this.exhibitedUpperIndex)) {
      this.actualTablePage = (this.exhibitedUpperIndex / this.quantityExhibitedSP);
    } else {
      this.actualTablePage = this.totalTablePages;
    }
  }

}
