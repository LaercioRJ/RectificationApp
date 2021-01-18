import { Injectable } from '@angular/core';

import { LayerStorageService } from '../services/layer-storage.service';
import { MessageDeliveryService } from '../services/message-delivery.service';

import { SamplingPoint } from '../classes/sampling-point';
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
  private samplingPoints: SamplingPoint[] = [];
  private fileExtension: string;
  private fileName: string;
  private fileSize: number;

  fileToLayer(file: File): Layer {
    this.confirmArchiveType(file.name);
    this.getFileInfo(file);
    const layer: Layer = this.getFileContentAndStore(file);
    return layer;
  }

  private confirmArchiveType(name: string): void {
    const extension = name.slice(name.length - 4, name.length);
    if (extension !== '.txt' && extension !== '.csv') {
      this.messageDelivery.showTimedMessage('O arquivo inserido não é de formato suportado, por favor use .csv ou .txt.', 2800);
      throw new Error('Unsupported file format');
    }
    this.fileExtension = extension;
  }

  private getFileInfo(file: File): void {
    this.fileName = file.name.slice(0, file.name.length - 4);
    this.fileSize = file.size;
  }

  private getFileContentAndStore(file: File): any {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const fileContent = reader.result as string;
      const haveHeaders = this.extractHeaders(fileContent.split(/\n/)[0]);
      const layer: Layer = this.extractSamplingPoints(haveHeaders, fileContent);
      return layer;
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

  private extractSamplingPoints(haveHeaders: number, fileContent: any): Layer {
    let lineIndex = haveHeaders;
    let fileLines: string[];
    let lineValues: string[];
    fileLines = fileContent.split(/\n/);
    for (; lineIndex < fileLines.length; lineIndex++) {
      lineValues = fileLines[lineIndex].split(',');
      this.samplingPoints.push(new SamplingPoint(Number(lineValues[0]), Number(lineValues[1]), Number(lineValues[2])));
    }
    const layer = this.storeLayer();
    return layer;
  }

  private storeLayer(): Layer {
    const layer = new Layer(this.header1, this.header2, this.header3);
    layer.samplingPoints = this.samplingPoints;
    layer.pointsQuantity = this.samplingPoints.length;
    layer.fileName = this.fileName;
    layer.fileSize = this.fileSize;
    layer.fileExtension = this.fileExtension;
    this.layerStorage.storeOriginalLayer(layer);
    this.samplingPoints = [];
    this.messageDelivery.showMessageWithButtonRoute('Layer importada com sucesso', 'Visualizar mapa', 'mapeamento/layer-unica');
    return layer;
  }
}
