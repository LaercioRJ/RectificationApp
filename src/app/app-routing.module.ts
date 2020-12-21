import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RectificationFormComponent } from './rectification-form/rectification-form.component';

const routes: Routes = [
  { path: '', component: RectificationFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
