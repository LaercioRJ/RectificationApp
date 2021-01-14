import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Tile } from 'ol/layer';
import ScaleLine from 'ol/control/ScaleLine';
import {defaults as defaultControls, FullScreen} from 'ol/control';
import Circle from 'ol/style/Circle';
import { Vector } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { Style } from 'ol/style';

import { LayerStorageService } from '../../services/layer-storage.service';
import { MappingService } from '../services/mapping.service';

import { Layer } from '../../classes/layer';

import { GradientComponent } from '../map-color-customization/gradient/gradient.component';
import { PerClassCustomizationComponent } from '../map-color-customization/per-class-customization/per-class-customization.component';
import { SelectExportedExtensionComponent } from '../../extra-components/select-exported-extension/select-exported-extension.component';

export interface LegendData {
  color: string;
  class: string;
}

const TABLE_DATA: LegendData[] = [
  {color: '', class: '1'},
  {color: '', class: '2'},
  {color: '', class: '3'},
  {color: '', class: '4'},
  {color: '', class: '5'},
  {color: '', class: 'Seletor'}
];

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {

  constructor(private bottomSheet: MatBottomSheet,
              private layerStorage: LayerStorageService,
              private mappingService: MappingService,
              private matDialog: MatDialog) { }

  map: Map;
  samplingPointsColors = [
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 0],
    [0, 128, 0],
    [139, 0, 0],
    [0, 0, 0], // this is the color for the selected samplingPoint
    [0, 0, 0] // this is the color for the gradient applied previously
  ];
  private vectorSource: VectorSource;
  private vectorLayerFeatures = [];
  private vectorLayer: Vector;

  originalLayer: Layer;
  rectifiedLayer: Layer = null;
  selectedLayer: Layer = null;
  selectedSamplingPointId = -1;
  selectedSPFirstCoordinate = 0;
  selectedSPSecondCoordinate = 0;
  selectedSPData = 0;
  SPDataFromOtherLayer = 0;
  mapTypes: string[] = ['Original', 'Retificado'];
  selectedMapType = 'Original';

  dataSource = TABLE_DATA;
  displayedColumns: string[] = ['Cor', 'Classe'];

  ngOnInit(): void {
    this.originalLayer = this.layerStorage.getOriginalLayer();
    this.selectedLayer = this.originalLayer;
    this.mappingService.renderMap(this.selectedLayer.samplingPoints, this.samplingPointsColors);
  }

  exportLayer(): void {
    const layerType = 'Retificada';
    this.bottomSheet.open(SelectExportedExtensionComponent, {
      data: { layerType }
    });
  }

  changeSelectedMap(mapType: string): void {
    if (this.selectedSamplingPointId !== -1) {
      this.unchooseSamplingPoint();
    }
    if (mapType === 'Original') {
      this.selectedLayer = this.originalLayer;
      this.mappingService.updateMap(this.selectedLayer.samplingPoints, this.samplingPointsColors);
    } else {
      if (this.rectifiedLayer === null) {
        this.rectifiedLayer = this.layerStorage.getRectifiedLayer();
      }
      this.selectedLayer = this.rectifiedLayer;
      this.mappingService.updateMap(this.selectedLayer.samplingPoints, this.samplingPointsColors);
    }
  }

  selectSamplingPoint(clickEvent: Event): void {
    try{
      const clickedSPId = this.mappingService.getClickedSamplingPointId(clickEvent);
      if (this.selectedSamplingPointId === -1) {
        // there was no sampling point already choosen
        this.chooseNewSamplingPoint(clickedSPId);
      } else {
        if (clickedSPId === this.selectedSamplingPointId) {
          // the clicked sampling point was already selected
          this.unchooseSamplingPoint();
        } else {
          // the user chose another sampling point than the previously selected
          this.chooseAnotherSamplingpoint(clickedSPId);
        }
      }
    } catch (err) {
      // there will be an error every time that a click happens outside the boundaries of a samplingPoint
    }
  }

  chooseNewSamplingPoint(chosenSamplingPointId: number): void {
    this.mappingService.changeSamplingPointColor(chosenSamplingPointId, this.samplingPointsColors[5]);
    this.selectedSamplingPointId = chosenSamplingPointId;
    this.selectedSPFirstCoordinate = this.selectedLayer.samplingPoints[chosenSamplingPointId].coordinates[0];
    this.selectedSPSecondCoordinate = this.selectedLayer.samplingPoints[chosenSamplingPointId].coordinates[1];
    this.selectedSPData = this.selectedLayer.samplingPoints[chosenSamplingPointId].data;
    if (this.selectedMapType === 'Original') {
      if (this.rectifiedLayer === null) {
        this.SPDataFromOtherLayer = this.layerStorage.getRectifiedLayer().samplingPoints[chosenSamplingPointId].data;
      } else {
        this.SPDataFromOtherLayer = this.rectifiedLayer.samplingPoints[chosenSamplingPointId].data;
      }
    } else {
      this.SPDataFromOtherLayer = this.originalLayer.samplingPoints[chosenSamplingPointId].data;
    }
  }

  unchooseSamplingPoint(): void {
    const samplingPointClass = this.selectedLayer.samplingPoints[this.selectedSamplingPointId].data;
    this.mappingService.changeSamplingPointColor(this.selectedSamplingPointId, this.samplingPointsColors[samplingPointClass - 1]);
    this.selectedSPFirstCoordinate = 0;
    this.selectedSPSecondCoordinate = 0;
    this.selectedSPData = 0;
    this.selectedSamplingPointId = -1;
    this.SPDataFromOtherLayer = 0;
  }

  chooseAnotherSamplingpoint(chosenSamplingPoint: number): void {
    this.unchooseSamplingPoint();
    this.chooseNewSamplingPoint(chosenSamplingPoint);
  }

  changeSamplingPointColor(featureId: number, newColorRgb: number[]): void {
    this.vectorLayerFeatures[featureId].setStyle(new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({ color: newColorRgb })
      })
    }));
  }

  openGradientDialog(): void {
    const classColors = this.samplingPointsColors;
    const mapGradientDialog = this.matDialog.open(GradientComponent, {
      width: '35vw',
      disableClose: true,
      data: { classColors }
    });

    mapGradientDialog.afterClosed().subscribe(result => {
      if (result && (this.samplingPointsColors !== result.data)) {
        this.samplingPointsColors = result.data;
        for (let i = 0; i < 5; i++) {
          this.refreshLegendTable(i + 1);
        }
        this.mappingService.updateMap(this.selectedLayer.samplingPoints, this.samplingPointsColors);
        if (this.selectedSamplingPointId !== -1) {
          console.log('Aqui');
          const color = this.samplingPointsColors[this.selectedSPData - 1];
          this.changeSamplingPointColor(this.selectedSamplingPointId, this.samplingPointsColors[5]);
        }
      }
    });
  }

  openPerClassCustomizationDialog(classNumber: number): void {
    const classColor = this.samplingPointsColors[classNumber - 1];
    const perClassCustomizationDialog = this.matDialog.open(PerClassCustomizationComponent, {
      width: '35vw',
      data: { classColor, classNumber }
    });

    perClassCustomizationDialog.afterClosed().subscribe(result => {
      if (result) {
        this.samplingPointsColors[classNumber - 1] = result.data;
        if (classNumber !== 6) {
          // caso for alteração do seletor
          this.mappingService.updateMap(this.selectedLayer.samplingPoints, this.samplingPointsColors);
        }
        if (this.selectedSamplingPointId !== -1) {
          const color = this.samplingPointsColors[this.selectedSPData];
          this.mappingService.changeSamplingPointColor(this.selectedSamplingPointId, this.samplingPointsColors[5]);
        }
        this.refreshLegendTable(classNumber);
      }
    });
  }

  refreshLegendTable(classNumber: number): void {
    const rgbCode = 'rgb(' + this.samplingPointsColors[classNumber - 1][0].toString() + ', ' +
      this.samplingPointsColors[classNumber - 1][1].toString() + ', ' + this.samplingPointsColors[classNumber - 1][2].toString() + ')';
    if (classNumber === 6) {
      document.getElementById('circleSeletor').style.background = rgbCode;
    } else {
      document.getElementById('circle'.concat(String(classNumber))).style.background = rgbCode;
    }
  }

  downloadMapJpg(): void {
    this.mappingService.downloadMapJpg();
  }
}
