import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Layer } from '../../classes/layer';

import { LayerStorageService } from '../../services/layer-storage.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';

@Component({
  selector: 'app-save-layer-alterations',
  templateUrl: './save-layer-alterations.component.html',
  styleUrls: ['./save-layer-alterations.component.css']
})
export class SaveLayerAlterationsComponent implements OnInit {

  constructor(private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService,
              private saveLayerDialogReference: MatDialogRef<SaveLayerAlterationsComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  saveOptions: string[] = ['Descartar alterações.', 'Salvar alterações.'];
  selectedOption = 'Salvar alterações.';

  ngOnInit(): void {
    console.log(this.data);
  }

  finishEditing(): void {
    let resetTableContent = false;
    if (this.selectedOption === 'Descartar alterações.') {
      resetTableContent = true;
      this.messageDelivery.showTimedMessage('Todas as alterações foram excluídas.', 2400);
    } else {
      this.layerStorage.updateOriginalLayer(this.data.alteredSamplingPoints, this.data.alteredSamplingPointsIndex);
      this.messageDelivery.showTimedMessage('Todas as alterações foram salvas.', 2400);
    }
    this.saveLayerDialogReference.close({
      resetTableContent
    });
  }

}
