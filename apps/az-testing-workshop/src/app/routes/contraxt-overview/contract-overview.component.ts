import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContractTableComponent } from '../../components/contract-table/contract-table.components';
import { ContractOverviewStore } from './contract-overview.store';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxErrorModule } from '@aposin/ng-aquila/base';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContractTableComponent, NxSpinnerModule, NxErrorModule],
  providers: [ContractOverviewStore],
  selector: 'contraxt-overview',
  standalone: true,
  styleUrl: './contract-overview.component.scss',
  templateUrl: './contract-overview.component.html',
})
export default class ContractOverviewComponent {
  store = inject(ContractOverviewStore);
}
