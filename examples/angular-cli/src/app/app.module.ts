import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AmChartsModule } from '@amcharts/amcharts3-angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
