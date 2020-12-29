import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './top-bar/top-bar.component';
import { MaterialModule } from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RectificationFormComponent } from './rectification-form/rectification-form.component';
import { MappingComponent } from './mapping/mapping.component';
import { ManagementZoneEditorComponent } from './management-zone-editor/management-zone-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    RectificationFormComponent,
    MappingComponent,
    ManagementZoneEditorComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
