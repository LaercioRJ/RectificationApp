import { Component, OnInit } from '@angular/core';

import Map from '../../../node_modules/ol/Map';
import OSM from '../../../node_modules/ol/source/OSM';
import View from '../../../node_modules/ol/View';
import { fromLonLat } from '../../../node_modules/ol/proj';
import { Tile } from '../../../node_modules/ol/layer.js';
import ScaleLine from '../../../node_modules/ol/control/ScaleLine';
import {defaults as defaultControls, FullScreen} from 'ol/control';

import { LayerStorageService } from '../services/layer-storage.service';

import { Layer } from '../classes/layer';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {

  constructor(private layerStorage: LayerStorageService) { }

  originalLayer: Layer;
  rectifiedLayer: Layer;
  map: Map;

  ngOnInit(): void {
    this.originalLayer = this.layerStorage.getOriginalLayer();
    this.createMap();
  }

  createMap(): void {
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
      ],
      view: new View({
        center: fromLonLat([this.originalLayer.samplingPoints[0].coordinates[0], this.originalLayer.samplingPoints[0].coordinates[1]]),
        zoom: 5,
        maxResolution: 120,
      }),
    });
  }
}
