import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorTableComponent } from './management-zone-editor/editor-table/editor-table.component';
import { SingleLayerMapComponent } from './mapping-module/map-exhibition/single-layer-map/single-layer-map.component';
import { MultipleLayerMapComponent } from './mapping-module/map-exhibition/multiple-layer-map/multiple-layer-map.component';
import { RectificationFormComponent } from './rectification-form/rectification-form.component';

import { SaveBeforeLeave } from './guards/save-before-leave';

const routes: Routes = [
  { path: '', component: RectificationFormComponent },
  { path: 'mapeamento/layer-unica', component: SingleLayerMapComponent },
  { path: 'mapeamento/varias-layers', component: MultipleLayerMapComponent },
  { path: 'edicao', component: EditorTableComponent, canDeactivate: [SaveBeforeLeave] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
