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
import { PerClassCustomizationComponent } from './mapping-module/map-color-customization/per-class-customization/per-class-customization.component';
import { SelectExportedExtensionComponent } from './extra-components/select-exported-extension/select-exported-extension.component';
import { MultipleLayerMapComponent } from './mapping-module/map-exhibition/multiple-layer-map/multiple-layer-map.component';
import { SingleLayerMapComponent } from './mapping-module/map-exhibition/single-layer-map/single-layer-map.component';

@NgModule({
  declarations: [
    AppComponent,
    RectificationFormComponent,
    MappingComponent,
    GradientComponent,
    EditorTableComponent,
    SaveLayerAlterationsComponent,
    PerClassCustomizationComponent,
    SelectExportedExtensionComponent,
    MultipleLayerMapComponent,
    SingleLayerMapComponent,
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
