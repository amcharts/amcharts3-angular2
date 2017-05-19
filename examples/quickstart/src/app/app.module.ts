import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { AmChartsModule } from "@amcharts/amcharts3-angular";

@NgModule({
  imports:      [ BrowserModule, AmChartsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
