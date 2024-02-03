import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { NxDataDisplayModule } from '@aposin/ng-aquila/data-display';
import { DatePipe } from '@angular/common';
import { emptyContract } from '../../common/empty-contract';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'contract-display',
  standalone: true,
  styleUrl: './contract-display.component.scss',
  templateUrl: './contract-display.component.html',
  imports: [NxDataDisplayModule, DatePipe],
})
export class ContractDisplayComponent {
  @Input({ required: true }) contract: Contract = emptyContract;
}
