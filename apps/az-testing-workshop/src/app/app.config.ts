import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NxExpertModule } from '@aposin/ng-aquila/config';
import { NxDocumentationIconModule } from '@aposin/ng-aquila/documentation-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(),
    importProvidersFrom(NxExpertModule, NxDocumentationIconModule),
    { provide: LOCALE_ID, useValue: 'de-DE' },
  ],
};
