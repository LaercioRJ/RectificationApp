import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { LayerImportingService } from '../services/layer-importing.service';
import { LayerStorageService } from '../services/layer-storage.service';
import { MessageDeliveryService } from '../services/message-delivery.service';
import { ResponseToLayerService } from '../services/response-to-layer.service';
import { ServerConnectionService } from '../services/server-connection.service';

import { SelectExportedExtensionComponent } from '../extra-components/select-exported-extension/select-exported-extension.component';

import { Layer } from '../classes/layer';

@Component({
  selector: 'app-rectification-form',
  templateUrl: './rectification-form.component.html',
  styleUrls: ['./rectification-form.component.css']
})
export class RectificationFormComponent implements OnInit {

  constructor(private bottomSheet: MatBottomSheet,
              private layerImporting: LayerImportingService,
              private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService,
              private responseConvertion: ResponseToLayerService,
              private router: Router,
              private serverConnection: ServerConnectionService) { }

  kernelSizes: string[] = ['3x3', '5x5', '7x7', '9x9', '11x11'];
  selectedKernelSize = '3x3';
  kernelFormats: string[] = ['Retangular', 'Elipse', 'Cruz'];
  selectedKernelFormat = 'Retangular';
  rectificationMethods: string[] = ['Mediana', 'Aberto', 'Fechado', 'Aberto e Fechado'];
  selectedRectificationMethod = 'Mediana';
  iterations: number[] = [1, 2, 3, 4, 5, 6];
  selectedIteration = 1;
  customIteration = 7;
  customIterationPreviousValue = 7;

  fileExtension = '--';
  fileSize = 0;
  fileName = '--';
  fileSamplingPointsQuantity = 0;

  loadBarState = 'none';

  ngOnInit(): void {
    this.fetchInsertedLayer();
  }

  fetchInsertedLayer(): void {
    if (this.layerStorage.originalLayerIsStored() === true) {
      this.fileExtension = this.layerStorage.getOriginalLayer().fileExtension;
      this.fileName = this.layerStorage.getOriginalLayer().fileName;
      this.fileSize = this.layerStorage.getOriginalLayer().fileSize;
      this.fileSamplingPointsQuantity = this.layerStorage.getOriginalLayer().pointsQuantity;
    }
  }

  exportOriginalLayer(): void {
    const layerType = 'Original';
    const extensionSelectorRef = this.bottomSheet.open(SelectExportedExtensionComponent, {
      data: { layerType }
    });
  }

  validateIterationNumber(): void{
    const inputValue = this.customIteration;
    if ((parseFloat(String(inputValue)) === parseInt(String(inputValue), 10)) && inputValue > 6 && inputValue <= 25) {
      this.customIterationPreviousValue = this.customIteration;
    } else {
      if (!(parseFloat(String(inputValue)) === parseInt(String(inputValue), 10))) {
        this.messageDelivery.showTimedMessage('Por favor, utilize apenas valores inteiros', 2100);
      } else {
        this.messageDelivery.showTimedMessage('Por favor, utilize valores entre 7 e 25', 2100);
      }
      this.customIteration = this.customIterationPreviousValue;
    }
  }

  async recieveNewArchive(event: any): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      const archive: File = event.target.files[0];
      const layer: Layer = await this.layerImporting.fileToLayer(archive);
    }
  }

  goToFileEditor(): void {
    this.router.navigateByUrl('edicao');
  }

  visualizeOriginalLayerMap(): void {
    this.router.navigateByUrl('mapeamento/layer-unica');
  }

  executeRectification(): void {
    let kFormat: string;
    let kSize: number;
    let rMethod: string;
    let iteration: number;
    this.loadBarState = 'block';

    switch (this.selectedKernelFormat) {
      case 'Retangular':
        kFormat = 'rect';
        break;
      case 'Elipse':
        kFormat = 'ellipse';
        break;
      case 'Cruz':
        kFormat = 'cross';
        break;
    }

    switch (this.selectedKernelSize) {
      case '3x3':
        kSize = 3;
        break;
      case '5x5':
        kSize = 5;
        break;
      case '7x7':
        kSize = 7;
        break;
      case '9x9':
        kSize = 9;
        break;
      case '11x11':
        kSize = 11;
        break;
    }

    switch (this.selectedRectificationMethod) {
      case 'Mediana':
        rMethod = 'median';
        break;
      case 'Aberto':
        rMethod = 'open';
        break;
      case 'Fechado':
        rMethod = 'close';
        break;
      case 'Aberto e Fechado':
        rMethod = 'openandclose';
        break;
    }

    if (Number(this.selectedIteration) === 7) {
      iteration = this.customIteration;
    } else {
      iteration = Number(this.selectedIteration);
    }

    this.serverConnection.consumeRectification(kFormat, kSize, rMethod, iteration).subscribe(result => {
      this.responseConvertion.convertResponseToLayer(result.body);
      this.loadBarState = 'none';
      this.router.navigateByUrl('mapeamento/varias-layers');
    },
      err => {
        this.messageDelivery.showTimedMessage('Houve algum problema na conexão com o servidor, por favor tente novamente' +
          'mais tarde.', 3200);
      });
  }

}
