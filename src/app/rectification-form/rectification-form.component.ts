import { Component, OnInit } from '@angular/core';

import { LayerImportingService } from '../services/layer-importing.service';
import { MessageDeliveryService } from '../services/message-delivery.service';
import { ServerConnectionService } from '../services/server-connection.service';

@Component({
  selector: 'app-rectification-form',
  templateUrl: './rectification-form.component.html',
  styleUrls: ['./rectification-form.component.css']
})
export class RectificationFormComponent implements OnInit {

  constructor(private layerImporting: LayerImportingService,
              private messageDelivery: MessageDeliveryService,
              private serverConnection: ServerConnectionService) { }

  kernelSizes: string[] = ['3x3', '5x5', '7x7', '9x9', '11x11'];
  selectedKernelSize = '3x3';
  kernelFormats: string[] = ['Retangular', 'Elipse', 'Cruz'];
  selectedKernelFormat = 'Retangular';
  rectificationMethods: string[] = ['Mediana', 'Aberto', 'Fechado', 'Aberto e Fechado'];
  selectedRectificationMethod = 'Mediana';
  iterations: number[] = [1, 2, 3, 4, 5, 6];
  selectedIteration = 1;

  fileExtension = '--';
  fileSize = 0;
  fileName = '--';

  ngOnInit(): void {
  }

  recieveNewArchive(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const archive: File = event.target.files[0];
      const fileIsRight = this.ArchiveTypeIsCorrect(archive.name);
      if (fileIsRight) {
        this.fileSize = archive.size;
        this.fileName = archive.name.slice(0, archive.name.length - 4);
        this.layerImporting.fileToLayer(archive);
      } else {
        this.messageDelivery.showTimedMessage('Formato de arquivo não suportado, por favor use .txt ou .csv.', 2800);
      }
    }
  }

  ArchiveTypeIsCorrect(fileName: string): boolean {
    const extension = fileName.slice(fileName.length - 4, fileName.length);
    if (extension === '.txt' || extension === '.csv') {
      this.fileExtension = extension;
      return true;
    } else {
      return false;
    }
  }

  executeRectification(): void {
    let kFormat: string;
    let kSize: number;
    let rMethod: string;

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

    this.serverConnection.consumeRectification(kFormat, kSize, rMethod, this.selectedIteration).subscribe(result => {
      console.log(result.body);
    },
      err => {
        console.log('Deu ruim');
      });
  }

}
