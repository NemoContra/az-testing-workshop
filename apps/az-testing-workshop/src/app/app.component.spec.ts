import { createComponentFactory } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterOutlet],
  });

  it('should render router-outlet', () => {
    const spectator = createComponent();
    expect(spectator.query(RouterOutlet)).toExist();
  });
});
