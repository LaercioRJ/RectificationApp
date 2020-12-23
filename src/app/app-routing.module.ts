import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MappingComponent } from './mapping/mapping.component';
import { RectificationFormComponent } from './rectification-form/rectification-form.component';

const routes: Routes = [
  { path: '', component: RectificationFormComponent },
  { path: 'mapeamento/:mode', component: MappingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
