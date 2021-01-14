import { Injectable } from '@angular/core';

import { LayerStorageService } from '../services/layer-storage.service';

import { Layer } from '../classes/layer';
import { SamplingPoint } from '../classes/sampling-point';

@Injectable({
  providedIn: 'root'
})
export class ResponseToLayerService {

  constructor(private layerStorage: LayerStorageService) { }

  convertResponseToLayer(response: any): void {
    const originalLayer = this.layerStorage.getOriginalLayer();
    const rectifiedLayer = new Layer(originalLayer.header1, originalLayer.header2, originalLayer.header3);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < response.length; i++) {
      const samplingPoint = new SamplingPoint(response[i].x, response[i].y, response[i].data);
      rectifiedLayer.samplingPoints.push(samplingPoint);
    }
    rectifiedLayer.fileName = originalLayer.fileName;
    rectifiedLayer.pointsQuantity = rectifiedLayer.samplingPoints.length;
    this.layerStorage.storeRectifiedLayer(rectifiedLayer);
  }
}
