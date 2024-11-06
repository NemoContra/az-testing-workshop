import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ContractTableComponent } from '../../shared/contract-table/contract-table.components';
import { ContractOverviewStore } from './contract-overview.store';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { Router } from '@angular/router';
import { explicitEffect } from 'ngxtension/explicit-effect';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContractTableComponent, NxSpinnerModule, NxErrorModule],
  selector: 'contract-overview',
  standalone: true,
  styleUrl: './contract-overview.component.scss',
  templateUrl: './contract-overview.component.html',
})
export default class ContractOverviewComponent {
  query = input<string>();

  overviewStore = inject(ContractOverviewStore);
  private router = inject(Router);

  #queryEffect = explicitEffect([this.query], ([query]) => {
    if (query !== undefined) this.overviewStore.setQuery(query);
  });

  async setQuery(query = '') {
    await this.router.navigate(
      [],
      query ? { queryParams: { query } } : undefined
    );
  }
}
