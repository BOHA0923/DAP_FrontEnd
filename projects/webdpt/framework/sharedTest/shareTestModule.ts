import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateTestingModule } from './translateTesting.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const shareTestModules = [
    BrowserModule,
    NoopAnimationsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    TranslateTestingModule,
    // FrameworkUIModule.forRoot([]), // framework 不可引用 components
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
 ];

