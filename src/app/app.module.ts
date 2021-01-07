import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './top-bar/top-bar.component';
import { MaterialModule } from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RectificationFormComponent } from './rectification-form/rectification-form.component';
import { MappingComponent } from './mapping-module/mapping/mapping.component';
import { GradientComponent } from './mapping-module/map-color-customization/gradient/gradient.component';
import { EditorTableComponent } from './management-zone-editor/editor-table/editor-table.component';
import { SaveLayerAlterationsComponent } from './management-zone-editor/save-layer-alterations/save-layer-alterations.component';

import { SaveBeforeLeave } from './guards/save-before-leave';

@NgModule({
  declarations: [
    AppComponent,
    RectificationFormComponent,
    MappingComponent,
    GradientComponent,
    EditorTableComponent,
    SaveLayerAlterationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [GradientComponent, SaveBeforeLeave],
  bootstrap: [AppComponent]
})
export class AppModule { }
