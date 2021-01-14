import { Injectable } from '@angular/core';

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

import { SamplingPoint } from '../../classes/sampling-point';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  private vectorSource: VectorSource;
  private vectorLayerFeatures = [];
  private vectorLayer: Vector;

  private map: Map;

  constructor() { }

  renderMap(samplingPoints: SamplingPoint[], classesColors: any): void {
    this.populateVectorlayer(samplingPoints, classesColors);
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
        center: fromLonLat([samplingPoints[0].coordinates[0], samplingPoints[1].coordinates[1]]),
        zoom: 5,
        maxResolution: 120,
      }),
    });
  }

  private populateVectorlayer(samplingPoints: SamplingPoint[], classesColors: any): void {
    for (let i = 0 ; i < samplingPoints.length; i++) {
      this.vectorLayerFeatures[i] = new Feature({
        geometry: new Point(fromLonLat([samplingPoints[i].coordinates[0], samplingPoints[i].coordinates[1]]))
      });
      this.vectorLayerFeatures[i].setStyle(new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({ color: classesColors[samplingPoints[i].data - 1] })
        })
      }));
      this.vectorLayerFeatures[i].setId(i);
    }
  }

  updateMap(samplingPoints: SamplingPoint[], classesColors: any): void {
    this.populateVectorlayer(samplingPoints, classesColors);

    this.vectorSource = new VectorSource({
      features: this.vectorLayerFeatures
    });

    this.vectorLayer = new Vector({
      source: this.vectorSource
    });

    this.map.removeLayer(this.map.getLayers().getArray()[1]);
    this.map.addLayer(this.vectorLayer);
    this.map.render();
  }

  changeSamplingPointColor(samplingPointId: number, newColorRgb: number[]): void {
    this.vectorLayerFeatures[samplingPointId].setStyle(new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({ color: newColorRgb })
      })
    }));
  }

  getClickedSamplingPointId(clickEvent: any): number {
    const eventPixel = this.map.getEventPixel(clickEvent);
    return this.map.getFeaturesAtPixel(eventPixel)[0].getId();
  }

  downloadMapJpg(): void {
    // tslint:disable-next-line: only-arrow-functions
    this.map.once('rendercomplete', function() {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = 1400;
      mapCanvas.height = 700;
      const mapContext = mapCanvas.getContext('2d');
      // tslint:disable-next-line: only-arrow-functions
      Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), function(canvas) {
        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
          const transformation = canvas.style.transform;
          const matrix = transformation.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext.drawImage(canvas, 0, 0);
        }
      });
      if (navigator.msSaveBlob) {
      } else {
        const element = document.createElement('a');
        element.setAttribute('href', mapCanvas.toDataURL());
        element.setAttribute('download', 'Mapa Zona de Manejo');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    });
    this.map.renderSync();
  }
}
