import { Injectable } from '@angular/core';

import { LayerStorageService } from './layer-storage.service';

import { Layer } from '../classes/layer';

@Injectable({
  providedIn: 'root'
})
export class LayerExportingService {

  constructor(private layerStorage: LayerStorageService) { }

  exportLayerToFile(layerType: string, archiveExtension: string): void {
    let layer: Layer;
    if (layerType === 'Original') {
      layer = this.layerStorage.getOriginalLayer();
    } else {
      layer = this.layerStorage.getRectifiedLayer();
    }
    const fileContent = this.convertLayerToString(layer);
    const file = this.createFile(fileContent, archiveExtension);
    this.downloadFile(file);
  }

  private convertLayerToString(layer: Layer): string[] {
    const content: string[] = [];
    for (let i = 0; i < layer.pointsQuantity; i++) {
      if (i === 0) {
        if (layer.header1 !== 'Longitude' && layer.header2 !== 'Latitude' && layer.header3 !== 'Classe') {
          content.push(layer.header1);
          content.push(layer.header2);
          content.push(layer.header3.concat('\n', String(layer.samplingPoints[i].coordinates[0])));
        } else {
          content.push(String(layer.samplingPoints[i].coordinates[0]));
        }
        content.push(String(layer.samplingPoints[i].coordinates[1]));
        content.push(String(layer.samplingPoints[i].data).concat('\n', String(layer.samplingPoints[i + 1].coordinates[0])));
      } else {
        if (i === (layer.pointsQuantity - 1)) {
          content.push(String(layer.samplingPoints[i].coordinates[1]));
          content.push(String(layer.samplingPoints[i].data));
        } else {
          content.push(String(layer.samplingPoints[i].coordinates[1]));
          content.push(String(layer.samplingPoints[i].data).concat('\n', String(layer.samplingPoints[i + 1].coordinates[0])));
        }
      }
    }
    return content;
  }

  private createFile(content: any, archiveType: string): HTMLAnchorElement {
    const file = document.createElement('a');
    file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    if (archiveType === '.txt') {
      file.setAttribute('download', 'ZonaDeManejo.txt');
    } else {
      file.setAttribute('download', 'ZonaDeManejo.csv');
    }
    file.style.display = 'none';
    return file;
  }

  private downloadFile(file: HTMLAnchorElement): void {
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
  }
}
