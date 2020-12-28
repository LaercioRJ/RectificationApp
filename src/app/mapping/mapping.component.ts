import { Component, OnInit } from '@angular/core';

import Map from '../../../node_modules/ol/Map';
import OSM from '../../../node_modules/ol/source/OSM';
import View from '../../../node_modules/ol/View';
import { fromLonLat } from '../../../node_modules/ol/proj';
import { Tile } from '../../../node_modules/ol/layer.js';
import ScaleLine from '../../../node_modules/ol/control/ScaleLine';
import {defaults as defaultControls, FullScreen} from 'ol/control';
import Circle from '../../../node_modules/ol/style/Circle';
import { Vector } from '../../../node_modules/ol/layer.js';
import VectorSource from '../../../node_modules/ol/source/Vector.js';
import Fill from '../../../node_modules/ol/style/Fill';
import Point from '../../../node_modules/ol/geom/Point';
import Feature from '../../../node_modules/ol/Feature';
import { Style } from '../../../node_modules/ol/style.js';

import { LayerStorageService } from '../services/layer-storage.service';

import { Layer } from '../classes/layer';
import { SamplingPoint } from '../classes/sampling-point';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {

  constructor(private layerStorage: LayerStorageService) { }

  private map: Map;
  samplingPointsColors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [0, 255, 255]
  ];
  private vectorSource: VectorSource;
  private vectorLayerFeatures = [];
  private vectorLayer: Vector;

  originalLayer: Layer;
  rectifiedLayer: Layer;

  ngOnInit(): void {
    this.originalLayer = this.layerStorage.getOriginalLayer();
    this.createMap();
  }

  private createMap(): void {
    this.populateVectorlayer(this.originalLayer.samplingPoints);

    this.vectorSource = new VectorSource({
      features: this.vectorLayerFeatures
    });

    this.vectorLayer = new Vector({
      source: this.vectorSource
    });

    this.map = new Map({
      target: 'map',
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'metric',
          minWidth: 100
        }),
        new FullScreen({
          tipLabel: 'Exibir em tela cheia'
        })
      ]),
      interactions: [],
      layers: [
        new Tile({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat([this.originalLayer.samplingPoints[0].coordinates[0], this.originalLayer.samplingPoints[0].coordinates[1]]),
        zoom: 5,
        maxResolution: 120,
      }),
    });
  }

  populateVectorlayer(samplingPoints: SamplingPoint[]): void {
    for (let i = 0 ; i < samplingPoints.length; i++) {
      this.vectorLayerFeatures[i] = new Feature({
        geometry: new Point(fromLonLat([samplingPoints[i].coordinates[0], samplingPoints[i].coordinates[1]]))
      });
      this.vectorLayerFeatures[i].setStyle(new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({ color: this.getClassColor(samplingPoints[i].data) })
        })
      }));
      this.vectorLayerFeatures[i].setId(i);
    }
  }

  getClassColor(classNumber: number): number[] {
    switch (classNumber) {
      case 1:
        return this.samplingPointsColors[0];
      case 2:
        return this.samplingPointsColors[1];
      case 3:
        return this.samplingPointsColors[2];
      case 4:
        return this.samplingPointsColors[3];
      case 5:
        return this.samplingPointsColors[4];
    }
  }
}
