import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { LayerExportingService } from '../../services/layer-exporting.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';

@Component({
  selector: 'app-select-exported-extension',
  templateUrl: './select-exported-extension.component.html',
  styleUrls: ['./select-exported-extension.component.css']
})
export class SelectExportedExtensionComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<SelectExportedExtensionComponent>,
              private layerExporting: LayerExportingService,
              private messageDelivery: MessageDeliveryService,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit(): void {
  }

  exportLayer(fileExtension: string): void {
    this.layerExporting.exportLayerToFile(this.data.layerType, fileExtension);
    this.messageDelivery.showTimedMessage('Layer exportada com sucesso!!!', 2400);
    this.closeBottomSheet();
  }

  closeBottomSheet(): void {
    this.bottomSheetRef.dismiss();
  }

}
