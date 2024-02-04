import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ContractTableComponent } from '../../components/contract-table/contract-table.components';
import { ContractOverviewStore } from './contract-overview.store';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContractTableComponent, NxSpinnerModule, NxErrorModule],
  selector: 'contract-overview',
  standalone: true,
  styleUrl: './contract-overview.component.scss',
  templateUrl: './contract-overview.component.html',
})
export default class ContractOverviewComponent {
  @Input() set query(query: string) {
    this.overviewStore.setQuery(query);
  }

  overviewStore = inject(ContractOverviewStore);
  private router = inject(Router);

  async setQuery(query: string) {
    await this.router.navigate(
      [],
      query ? { queryParams: { query } } : undefined
    );
  }
}
