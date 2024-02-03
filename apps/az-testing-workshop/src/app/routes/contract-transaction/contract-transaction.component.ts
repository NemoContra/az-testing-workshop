import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ContractTransactionStore } from './contract-transaction.store';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { TransactionTypePipe } from './transaction-type.pipe';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { Router, RouterLink } from '@angular/router';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { FormsModule } from '@angular/forms';
import {
  transactionQueryParam,
  TransactionsType,
  transactionTypes,
} from '../../common/transaction-type';
import { DatePipe } from '@angular/common';
import { NxMessageToastService } from '@aposin/ng-aquila/message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NxDropdownModule,
    NxFormfieldModule,
    TransactionTypePipe,
    NxIconModule,
    NxLinkModule,
    RouterLink,
    NxInputModule,
    NxSpinnerModule,
    NxButtonModule,
    FormsModule,
    DatePipe,
  ],
  providers: [ContractTransactionStore],
  selector: 'contract-transaction',
  standalone: true,
  styleUrl: './contract-transaction.component.scss',
  templateUrl: './contract-transaction.component.html',
})
export default class ContractTransactionComponent {
  @Input() set id(id: string) {
    this.store.getContract(id);
  }

  @Input() set transaktion(transaktion: TransactionsType | undefined) {
    if (transaktion) {
      this.store.selectTransaction(transaktion);
    }
  }

  store = inject(ContractTransactionStore);
  readonly transactionTypes = transactionTypes;

  private router = inject(Router);
  private messageToastService = inject(NxMessageToastService);

  async selectTransactionType(type: TransactionsType) {
    await this.router.navigate([], {
      queryParams: transactionQueryParam(type),
    });
  }

  submitAenderungNachname(
    lastname: string,
    { person, ...contract }: Contract
  ): void {
    this.store.updateContract({ ...contract, person: { ...person, lastname } });
    this.messageToastService.open(
      'Änderung des Nachname erfolgreich durchgeführt',
      {
        context: 'success',
        duration: 5000,
      }
    );
  }

  submitKuendigung(contract: Contract): void {
    this.store.updateContract({ ...contract, end: new Date().toDateString() });
    this.messageToastService.open('Kündigung erfolgreich durchgeführt', {
      context: 'success',
      duration: 5000,
    });
  }
}
