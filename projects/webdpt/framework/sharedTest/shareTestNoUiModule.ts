// import { FrameworkUIModule } from '../components/framework.ui.module';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateTestingModule } from './translateTesting.module';
// import { TranslateModule } from '@ngx-translate/core';


export const shareTestNoUiModules = [
    BrowserModule,
    NoopAnimationsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    // FrameworkUIModule.forRoot([]),
    ReactiveFormsModule,
    TranslateTestingModule
    // TranslateModule,
 ];
