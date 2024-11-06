import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { NxDataDisplayModule } from '@aposin/ng-aquila/data-display';
import { ContractDetailsStore } from './contract-details.store';
import { DatePipe } from '@angular/common';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { RouterLink } from '@angular/router';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { ContractDisplayComponent } from '../../shared/contract-display/contract-display.component';
import { explicitEffect } from 'ngxtension/explicit-effect';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NxDataDisplayModule,
    DatePipe,
    NxErrorModule,
    NxSpinnerModule,
    NxLinkModule,
    RouterLink,
    NxIconModule,
    ContractDisplayComponent,
  ],
  providers: [ContractDetailsStore],
  selector: 'contract-details',
  standalone: true,
  styleUrl: './contract-details.component.scss',
  templateUrl: './contract-details.component.html',
})
export default class ContractDetailsComponent {
  id = input.required<string>();
  #idEffect = explicitEffect([this.id], ([id]) => this.store.getContract(id));
  store = inject(ContractDetailsStore);
}
