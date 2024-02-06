import { type BaseHarnessFilters } from '@angular/cdk/testing';

export interface NxTabHarnessFilters extends BaseHarnessFilters {
  label?: string | RegExp;
  selected?: boolean;
}

export interface NxTabGroupHarnessFilters extends BaseHarnessFilters {
  selectedTabLabel?: string | RegExp;
}

export interface NxTabLinkHarnessFilters extends BaseHarnessFilters {
  label?: string | RegExp;
}

export type NxTabNavBarHarnessFilters = BaseHarnessFilters;
