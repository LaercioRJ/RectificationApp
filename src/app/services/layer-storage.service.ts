import { Injectable } from '@angular/core';

import { Layer } from '../classes/layer';
import { SamplingPoint } from '../classes/sampling-point';

@Injectable({
  providedIn: 'root'
})
export class LayerStorageService {

  constructor() { }

  private originalLayer: Layer = null;
  private rectifiedLayer: Layer;

  storeOriginalLayer(newLayer: Layer): void {
    this.originalLayer = newLayer;
  }

  getOriginalLayer(): Layer {
    const copiedLayer = new Layer(this.originalLayer.header1, this.originalLayer.header2, this.originalLayer.header3);
    copiedLayer.pointsQuantity = this.originalLayer.samplingPoints.length;
    for (let i = 0; i < copiedLayer.pointsQuantity; i++) {
      const samplingPoint = this.originalLayer.samplingPoints[i];
      const copiedSamplingP = new SamplingPoint(samplingPoint.coordinates[0], samplingPoint.coordinates[1], samplingPoint.data);
      copiedLayer.samplingPoints.push(copiedSamplingP);
    }
    return copiedLayer;
  }

  updateOriginalLayer(newSamplingPoints: SamplingPoint[], SPIndexList: number[]): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < SPIndexList.length; i++) {
      this.originalLayer.samplingPoints[SPIndexList[i]].data = newSamplingPoints[SPIndexList[i]].data;
    }
  }

  storeRectifiedLayer(newLayer: Layer): void {
    this.rectifiedLayer = newLayer;
  }

  getRectifiedLayer(): Layer {
    const copiedLayer = new Layer(this.rectifiedLayer.header1, this.rectifiedLayer.header2, this.rectifiedLayer.header3);
    copiedLayer.pointsQuantity = this.rectifiedLayer.samplingPoints.length;
    for (let i = 0; i < copiedLayer.pointsQuantity; i++) {
      const samplingPoint = this.rectifiedLayer.samplingPoints[i];
      const copiedSamplingP = new SamplingPoint(samplingPoint.coordinates[0], samplingPoint.coordinates[1], samplingPoint.data);
      copiedLayer.samplingPoints.push(copiedSamplingP);
    }
    return copiedLayer;
  }
}
