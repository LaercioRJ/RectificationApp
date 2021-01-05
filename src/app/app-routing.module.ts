import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorTableComponent } from './management-zone-editor/editor-table/editor-table.component';
import { MappingComponent } from './mapping-module/mapping/mapping.component';
import { RectificationFormComponent } from './rectification-form/rectification-form.component';

const routes: Routes = [
  { path: '', component: RectificationFormComponent },
  { path: 'mapeamento/:mode', component: MappingComponent },
  { path: 'edicao', component: EditorTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
