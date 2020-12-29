import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MappingComponent } from './mapping/mapping.component';
import { RectificationFormComponent } from './rectification-form/rectification-form.component';
import { ManagementZoneEditorComponent } from './management-zone-editor/management-zone-editor.component';

const routes: Routes = [
  { path: '', component: RectificationFormComponent },
  { path: 'mapeamento/:mode', component: MappingComponent },
  { path: 'edicao', component: ManagementZoneEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
