import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  type BaseHarnessFilters,
  ComponentHarness,
  type ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { type NxButtonType } from '@aposin/ng-aquila/button';

export class FonlIconHarness extends ComponentHarness {
  static hostSelector = `fonl-icon`;
  private _matIcon = this.locatorFor(MatIconHarness);

  async getName() {
    return (await this._matIcon()).getName();
  }
}

type Type = 'basic' | 'icon' | 'plain';

interface FonlNxButtonHarnessFilters extends BaseHarnessFilters {
  type?: Type;
  variant?: NxButtonType;
  /** Currently only works for fonl-icon **/
  iconName?: string;
  text?: string;
  href?: string | RegExp;
}

export class FonlNxButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = `[fonlnxbutton], [fonlnxiconbutton], [fonlnxplainbutton]`;

  static with<T extends FonlNxButtonHarness>(
    this: ComponentHarnessConstructor<T>,
    options: FonlNxButtonHarnessFilters = {}
  ) {
    return new HarnessPredicate(this, options)
      .addOption('type', options.type, async (harness, type) =>
        HarnessPredicate.stringMatches(await harness.getType(), type)
      )
      .addOption('variant', options.variant, async (harness, variant) =>
        HarnessPredicate.stringMatches(await harness.getVariant(), variant)
      )
      .addOption('text', options.text, async (harness, text) =>
        HarnessPredicate.stringMatches(await harness.getText(), text)
      )
      .addOption('href', options.href, async (harness, href) =>
        HarnessPredicate.stringMatches(await harness.getHref(), href)
      )
      .addOption('iconName', options.iconName, async (harness, iconName) =>
        iconName !== ''
          ? HarnessPredicate.stringMatches(
              (await harness.getFonlIconName()) ?? '',
              iconName
            )
          : false
      );
  }

  private _fonlIcon = this.locatorForOptional(FonlIconHarness);
  private _basicButtonText = this.locatorFor('span.fonl-nx-button__content');
  private _plainButtonText = this.locatorFor(
    'span.fonl-nx-plain-button__content'
  );

  /**
   * Clicks the button at the given position relative to its top-left.
   * @param relativeX The relative x position of the click.
   * @param relativeY The relative y position of the click.
   */
  click(relativeX: number, relativeY: number): Promise<void>;
  /** Clicks the button at its center. */
  click(location: 'center'): Promise<void>;
  /** Clicks the button. */
  click(): Promise<void>;
  async click(...args: [] | ['center'] | [number, number]): Promise<void> {
    return (await this.host()).click(...(args as []));
  }

  async getHref(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('href');
  }

  async getText(): Promise<string> {
    const type = await this.getType();
    switch (type) {
      case 'basic':
        return (await (await this._basicButtonText()).text()).trim();
      case 'plain':
        return (await (await this._plainButtonText()).text()).trim();
      case 'icon':
        return '';
    }
  }

  async getType(): Promise<Type> {
    const host = await this.host();
    // eslint-disable-next-line eqeqeq
    if ((await host.getAttribute('fonlnxbutton')) != null) {
      return 'basic';
      // eslint-disable-next-line eqeqeq
    } else if ((await host.getAttribute('fonlNxIconButton')) != null) {
      return 'icon';
      // eslint-disable-next-line eqeqeq
    } else if ((await host.getAttribute('fonlNxPlainButton')) != null) {
      return 'plain';
    }

    return 'basic';
  }

  async getVariant(): Promise<NxButtonType> {
    const host = await this.host();
    if (await host.hasClass('fonl-nx-button--primary')) return 'primary';
    if (await host.hasClass('fonl-nx-button--secondary')) return 'secondary';
    if (await host.hasClass('fonl-nx-button--tertiary')) return 'tertiary';
    if (await host.hasClass('fonl-nx-button--cta')) return 'cta';
    if (await host.hasClass('fonl-nx-button--emphasis')) return 'emphasis';
    return 'primary';
  }

  async isLoading() {
    return (await this.host()).hasClass('fonl-nx-button--loading');
  }

  async isDisabled() {
    const host = await this.host();
    const disabled = await host.getAttribute('disabled');
    const ariaDisabled = await host.getAttribute('aria-disabled');

    return (
      coerceBooleanProperty(disabled) || coerceBooleanProperty(ariaDisabled)
    );
  }

  /**
   * TODO: Differentiate between iconBefore, iconAfter, and IconButton, add nx-icon use case
   * Only for fonl-icon at the moment
   */
  async getFonlIconName() {
    const icon = await this._fonlIcon();
    return icon?.getName();
  }
}
