import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimplifiedUiModule } from '../../projects/simplified-ui/src/lib/simplified-ui.module'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatIconModule } from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SimplifiedUiModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },],
  bootstrap: [AppComponent]
})
export class AppModule { }
