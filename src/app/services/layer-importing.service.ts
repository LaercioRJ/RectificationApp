import { Injectable } from '@angular/core';

import { LayerStorageService } from '../services/layer-storage.service';
import { MessageDeliveryService } from '../services/message-delivery.service';

import { Samplingpoint } from '../classes/sampling-point';
import { Layer } from '../classes/layer';

@Injectable({
  providedIn: 'root'
})
export class LayerImportingService {

  constructor(private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService) { }

  private header1 = 'Latitude';
  private header2 = 'Longitude';
  private header3 = 'Classe';
  private samplingPoints: Samplingpoint[] = [];

  fileToLayer(file: File): void {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const fileContent = reader.result as string;
      const haveHeaders = this.extractHeaders(fileContent.split(/\n/)[0]);
      this.extractSamplingPoints(haveHeaders, fileContent);
    };
  }

  private extractHeaders(fileHeaders: string): number {
    const separatedHeaders: string[] = fileHeaders.split(',');
    if (isNaN(Number(separatedHeaders[0] + 1)) && isNaN(Number(separatedHeaders[1] + 1)) && isNaN(Number(separatedHeaders[2] + 1))) {
      this.header1 = separatedHeaders[0];
      this.header2 = separatedHeaders[1];
      this.header3 = separatedHeaders[2];
      return 1;
    } else {
      return 0;
    }
  }

  private extractSamplingPoints(haveHeaders: number, fileContent: any): void {
    let lineIndex = haveHeaders;
    let fileLines: string[];
    let lineValues: string[];
    fileLines = fileContent.split(/\n/);
    for (; lineIndex < fileLines.length; lineIndex++) {
      lineValues = fileLines[lineIndex].split(',');
      this.samplingPoints.push(new Samplingpoint(Number(lineValues[0]), Number(lineValues[1]), Number(lineValues[2])));
    }
    this.storeLayer();
  }

  private storeLayer(): void {
    const layer = new Layer(this.header1, this.header2, this.header3);
    layer.samplingPoints = this.samplingPoints;
    this.layerStorage.storeOriginalLayer(layer);
    this.messageDelivery.showTimedMessage('Layer importada com sucesso!', 2500);
  }
}
