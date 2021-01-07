import { Component, HostListener, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { LayerStorageService } from '../../services/layer-storage.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';

import { Layer } from '../../classes/layer';
import { SamplingPoint } from '../../classes/sampling-point';

import { SaveLayerAlterationsComponent } from '../save-layer-alterations/save-layer-alterations.component';
import { UrlTree } from '@angular/router';

@Component({
  selector: 'app-editor-table',
  templateUrl: './editor-table.component.html',
  styleUrls: ['./editor-table.component.css']
})
export class EditorTableComponent implements OnInit {

  constructor(private messageDelivery: MessageDeliveryService,
              private layerStorage: LayerStorageService,
              private saveLayerDialog: MatDialog) { }

  dataSource = new MatTableDataSource<SamplingPoint>();
  displayedColumns: string[];
  totalTablePages = 0;
  actualTablePage = 0;

  invalidAlteredSPIndex: number[] = [];
  validAlteredSPIndex: number[] = [];

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

  @HostListener('window:beforeunload')
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> | UrlTree {
    if ((this.isEditing === true) && (this.wasEdited === true)) {
      return confirm('Foram deitas alterações que ainda não foram gravadas');
    } else {
      return true;
    }
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

  openSaveLayerDialog(alteredSamplingPoints: SamplingPoint[], alteredSamplingPointsIndex: number[]): void{
    const dialogRef = this.saveLayerDialog.open(SaveLayerAlterationsComponent, {
      width: '22vw',
      disableClose: true,
      data: { alteredSamplingPoints, alteredSamplingPointsIndex }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.wasEdited = false;
      this.validAlteredSPIndex = [];
      this.invalidAlteredSPIndex = [];
      if (result.resetTableContent === true) {
        this.deleteAterations();
      }
    });
  }

  deleteAterations(): void {
    this.layer.samplingPoints = this.layerStorage.getOriginalLayer().samplingPoints;
    this.refreshTablePage();
  }

  refreshTablePage(): void {
    if ((this.exhibitedUpperIndex === this.layer.pointsQuantity) && ((this.layer.pointsQuantity % this.quantityExhibitedSP) !== 0)) {
      this.exhibitedUpperIndex = this.exhibitedUpperIndex - (this.layer.pointsQuantity % this.quantityExhibitedSP);
    } else {
      this.exhibitedUpperIndex = this.exhibitedUpperIndex - this.quantityExhibitedSP;
    }
    this.tablePaginatorNextPage();
  }

  tablePaginatorPreviousPage(): void {
    const exhibitedSP = [];
    if ((this.exhibitedUpperIndex === this.layer.pointsQuantity) && ((this.layer.pointsQuantity % this.quantityExhibitedSP) !== 0)) {
      this.exhibitedUpperIndex = this.exhibitedUpperIndex - (this.layer.pointsQuantity % this.quantityExhibitedSP);
    } else {
      this.exhibitedUpperIndex = this.exhibitedUpperIndex - this.quantityExhibitedSP;
    }
    for (let i = 0; i < this.quantityExhibitedSP; i++) {
      exhibitedSP.push(this.layer.samplingPoints[this.exhibitedUpperIndex - (this.quantityExhibitedSP - i)]);
    }
    this.dataSource.data = exhibitedSP;
    this.exhibitedLowerIndex = this.exhibitedLowerIndex - this.quantityExhibitedSP;
    this.calculateActualTablePage();
  }

  editDataInput(event: any, samplingPointIndex: number): void {
    this.wasEdited = true;
    const tableSPIndex: number = this.getTableSPIndex(samplingPointIndex);
    console.log(tableSPIndex);
    const cleanInput: boolean = this.validateNewSamplingValue(event.target.value);
    this.storeValidOrInvalidValues(cleanInput, tableSPIndex);
    this.layer.samplingPoints[tableSPIndex].data = Number(event.target.value);
  }

  getTableSPIndex(pageSPIndex: number): number {
    if ((this.layer.pointsQuantity % this.quantityExhibitedSP) !== 0) {
      if (this.layer.pointsQuantity === this.exhibitedUpperIndex) {
        return (this.exhibitedUpperIndex - (this.layer.pointsQuantity % this.quantityExhibitedSP)) + pageSPIndex;
      }
    }
    return (this.exhibitedUpperIndex - this.quantityExhibitedSP) + pageSPIndex;
  }

  validateNewSamplingValue(newValue: number): boolean {
    let validInput = true;
    if (Number(newValue) < 1 || Number(newValue) > 5) {
      validInput = false;
    }
    if (parseFloat(String(newValue)) !== parseInt(String(newValue), 10)) {
      validInput = false;
    }
    return validInput;
  }

  storeValidOrInvalidValues(cleanInput: boolean, tableSPIndex: number): void {
    if (cleanInput === true) {
      if (this.validAlteredSPIndex.lastIndexOf(tableSPIndex) === -1) {
        this.validAlteredSPIndex.push(tableSPIndex);
      }
      if (this.invalidAlteredSPIndex.lastIndexOf(tableSPIndex) !== -1) {
        this.invalidAlteredSPIndex.splice(this.invalidAlteredSPIndex.lastIndexOf(tableSPIndex), 1);
      }
    } else {
      if (this.invalidAlteredSPIndex.lastIndexOf(tableSPIndex) === -1) {
        this.invalidAlteredSPIndex.push(tableSPIndex);
      }
      if (this.validAlteredSPIndex.lastIndexOf(tableSPIndex) !== -1) {
        this.validAlteredSPIndex.splice(this.validAlteredSPIndex.lastIndexOf(tableSPIndex), 1);
      }
    }
  }

  showInvalidInputsMessage(): void {
    let message: string;
    message = 'Há pontos amostrais com valores de classe não suportados. Índices: ';
    message = message.concat(String(this.invalidAlteredSPIndex[0] + 1));
    for (let i = 1; i < this.invalidAlteredSPIndex.length; i++) {
      message = message.concat(', '.concat(String(this.invalidAlteredSPIndex[i] + 1)));
    }
    const timeOnScreen = 3000 + (this.invalidAlteredSPIndex.length * 500);
    this.messageDelivery.showTimedMessage(message, timeOnScreen);
  }

  turnOffEditing(event: any): void {
    if ((this.wasEdited === true) && (this.isEditing === false)) {
      if (this.invalidAlteredSPIndex.length > 0) {
        this.isEditing = true;
        event.source.checked = true;
        this.showInvalidInputsMessage();
      } else {
        this.openSaveLayerDialog(this.layer.samplingPoints, this.validAlteredSPIndex);
      }
    }
  }

}
