import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

declare const require: any;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Find and load all .spec.ts files
const context = (import.meta as any).webpackContext('./', { recursive: true, regExp: /\.spec\.ts$/ });
context.keys().forEach(context);


