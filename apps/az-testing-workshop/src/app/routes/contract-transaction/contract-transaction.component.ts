import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'contract-transaction',
  standalone: true,
  templateUrl: './contract-transaction.component.html',
})
export default class ContractTransactionComponent {}
