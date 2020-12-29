import { Component, OnInit } from '@angular/core';

import { Layer } from '../classes/layer';

import { LayerStorageService } from '../services/layer-storage.service';

@Component({
  selector: 'app-management-zone-editor',
  templateUrl: './management-zone-editor.component.html',
  styleUrls: ['./management-zone-editor.component.css']
})
export class ManagementZoneEditorComponent implements OnInit {

  constructor(private layerStorage: LayerStorageService) { }

  layer: Layer;

  ngOnInit(): void {
    this.layer = this.layerStorage.getOriginalLayer();
  }

}
