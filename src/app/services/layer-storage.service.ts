import { Injectable } from '@angular/core';

import { Layer } from '../classes/layer';

@Injectable({
  providedIn: 'root'
})
export class LayerStorageService {

  constructor() { }

  private originalLayer: Layer;
  private rectifiedLayer: Layer;

  storeOriginalLayer(newLayer: Layer): void {
    this.originalLayer = newLayer;
  }

  getOriginalLayer(): Layer {
    return this.originalLayer;
  }
}
