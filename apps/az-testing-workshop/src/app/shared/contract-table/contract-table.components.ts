import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { DatePipe } from '@angular/common';
import { NxTableModule } from '@aposin/ng-aquila/table';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { RouterLink } from '@angular/router';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { NxMenuModule } from '@aposin/ng-aquila/menu';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxContextMenuModule } from '@aposin/ng-aquila/context-menu';
import { transactionQueryParam } from '../../common/transaction-type';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { emptyContract } from '../../common/empty-contract';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'contract-table',
  standalone: true,
  templateUrl: './contract-table.component.html',
  imports: [
    NxTableModule,
    NxLinkModule,
    RouterLink,
    DatePipe,
    NxInputModule,
    NxIconModule,
    FormsModule,
    NxMenuModule,
    NxButtonModule,
    NxContextMenuModule,
  ],
})
export class ContractTableComponent {
  @Input({ required: true }) contracts: Contract[] = [emptyContract];
  query = signal<string | undefined>(undefined);
  @Output() queryChange = toObservable(this.query).pipe(
    filter((query) => query !== undefined),
    debounceTime(200),
    distinctUntilChanged()
  );

  aenderungNachnameQueryParams = transactionQueryParam('AenderungNachname');
  kuendigungQueryParams = transactionQueryParam('Kuendigung');
}
