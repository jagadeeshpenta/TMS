import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Component } from '@angular/core';
import { ApiUiComponent } from './comps/api-ui/api-ui.component';

import { ApiUiService } from './services/api-ui.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule
  ],
  declarations: [ApiUiComponent],
  exports: [],
  providers: [ApiUiService]
})
export class UiForApiModule {
  public static getRootComponent() {
    return {
      ApiUiComponent: ApiUiComponent
    };
  }
}


