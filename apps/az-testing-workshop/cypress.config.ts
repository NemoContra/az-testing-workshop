import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';

const e2eConfig: Partial<Cypress.EndToEndConfigOptions> = {
  defaultCommandTimeout: 10000,
  video: false,
};

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, { cypressDir: 'cypress' }),
    ...e2eConfig,
  },
  component: { ...nxComponentTestingPreset(__filename), video: false },
});
