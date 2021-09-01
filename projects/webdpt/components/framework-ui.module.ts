import { APP_INITIALIZER, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FullCalendarModule } from '@fullcalendar/angular';
import { DwLanguageCoreModule } from '@webdpt/components/core';

// import { NgQuicksilverModule } from 'ng-quicksilver';
import { DwAffixModule } from 'ng-quicksilver/affix';
import { DwAlertModule } from 'ng-quicksilver/alert';
import { DwAnchorModule } from 'ng-quicksilver/anchor';
import { DwAutocompleteModule } from 'ng-quicksilver/auto-complete';
import { DwAvatarModule } from 'ng-quicksilver/avatar';
import { DwBackTopModule } from 'ng-quicksilver/back-top';
import { DwBadgeModule } from 'ng-quicksilver/badge';
import { DwBreadCrumbModule } from 'ng-quicksilver/breadcrumb';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwCalendarModule } from 'ng-quicksilver/calendar';
import { DwCardModule } from 'ng-quicksilver/card';
import { DwCarouselModule } from 'ng-quicksilver/carousel';
import { DwCascaderModule } from 'ng-quicksilver/cascader';
import { DwCheckboxModule } from 'ng-quicksilver/checkbox';
import { DwCollapseModule } from 'ng-quicksilver/collapse';
import { DwCommentModule } from 'ng-quicksilver/comment';

import { DwNoAnimationModule } from 'ng-quicksilver/core/no-animation';
import { DwTransButtonModule } from 'ng-quicksilver/core/trans-button';
import { DwWaveModule } from 'ng-quicksilver/core/wave';
import { DwDatePickerModule } from 'ng-quicksilver/date-picker';
import { DwDescriptionsModule } from 'ng-quicksilver/descriptions';
import { DwDividerModule } from 'ng-quicksilver/divider';
import { DwDrawerModule } from 'ng-quicksilver/drawer';
import { DwDropDownModule } from 'ng-quicksilver/dropdown';
import { DwEmptyModule } from 'ng-quicksilver/empty';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwI18nModule } from 'ng-quicksilver/i18n';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwInputNumberModule } from 'ng-quicksilver/input-number';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwListModule } from 'ng-quicksilver/list';
import { DwMentionModule } from 'ng-quicksilver/mention';
import { DwMenuModule } from 'ng-quicksilver/menu';
import { DwMessageModule } from 'ng-quicksilver/message';
import { DwModalModule } from 'ng-quicksilver/modal';
import { DwNotificationModule } from 'ng-quicksilver/notification';
import { DwPageHeaderModule } from 'ng-quicksilver/page-header';
import { DwPaginationModule } from 'ng-quicksilver/pagination';
import { DwPopconfirmModule } from 'ng-quicksilver/popconfirm';
import { DwPopoverModule } from 'ng-quicksilver/popover';
import { DwProgressModule } from 'ng-quicksilver/progress';
import { DwRadioModule } from 'ng-quicksilver/radio';
import { DwRateModule } from 'ng-quicksilver/rate';
import { DwResultModule } from 'ng-quicksilver/result';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwSkeletonModule } from 'ng-quicksilver/skeleton';
import { DwSliderModule } from 'ng-quicksilver/slider';
import { DwSpinModule } from 'ng-quicksilver/spin';
import { DwStatisticModule } from 'ng-quicksilver/statistic';
import { DwStepsModule } from 'ng-quicksilver/steps';
import { DwSwitchModule } from 'ng-quicksilver/switch';
import { DwTableModule } from 'ng-quicksilver/table';
import { DwTabsModule } from 'ng-quicksilver/tabs';
import { DwTagModule } from 'ng-quicksilver/tag';
import { DwTimePickerModule } from 'ng-quicksilver/time-picker';
import { DwTimelineModule } from 'ng-quicksilver/timeline';
import { DwToolTipModule } from 'ng-quicksilver/tooltip';
import { DwTransferModule } from 'ng-quicksilver/transfer';
import { DwTreeModule } from 'ng-quicksilver/tree';
import { DwTreeSelectModule } from 'ng-quicksilver/tree-select';
import { DwTypographyModule } from 'ng-quicksilver/typography';
import { DwUploadModule } from 'ng-quicksilver/upload';
import { DwLanguageModule } from '@webdpt/components/language';

import { DwMenusModule } from '@webdpt/components/menu';
import { DwExceptionModule } from '@webdpt/components/exception';
import { DwActionModule } from '@webdpt/components/action';
import { DwIframeModule } from '@webdpt/components/iframe';
import { DwIconElementModule } from '@webdpt/components/icon-element';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwContainerModule } from '@webdpt/components/redevelop';
import { DwDivMaskModule } from '@webdpt/components/load-mask';
import { DwMainLayoutModule } from '@webdpt/components/layout';
import { DwLoginModule } from '@webdpt/components/login';
import { DwAgGridEditorsModule } from '@webdpt/components/ag-grid-editors';
import { DwSsoLoginModule } from '@webdpt/components/sso-login';
import { DwThemeButtonModule } from '@webdpt/components/theme-button';
import { DwDateToStringModule } from '@webdpt/components/date-to-string';
import { DwRoutingTabSetCoreModule } from '@webdpt/components/core';
import { DwLoadingModule } from '@webdpt/components/loading';
import { DwTenantModule } from '@webdpt/components/user/tenant';
import { DwUserUiModule } from '@webdpt/components/user';
import { DwRoutingTabSetModule } from '@webdpt/components/routing-tabset';
import { DwFinereportModule } from '@webdpt/components/finereport';
import { DwCronJobsModule } from '@webdpt/components/cron-jobs';
import { DwDevToolModule } from '@webdpt/components/dev-tool';
import { DwProgramTitleModule } from '@webdpt/components/title';
import { DwHttpMessageService } from '@webdpt/framework/http';
import { DwLoggingService } from '@webdpt/framework/errors';
import { DwLoggingModalService } from '@webdpt/components/exception';
import { DwHttpMessageServiceModalService } from '@webdpt/components/exception';
import { DwModalsModule } from '@webdpt/components/modals';
import { DwPagingModule } from '@webdpt/components/paging';

// ng-quicksilver version:9.3.0
const QUICKSILVER_MODULE = [
  DwAffixModule,
  DwAlertModule,
  DwAnchorModule,
  DwAutocompleteModule,
  DwAvatarModule,
  DwBackTopModule,
  DwBadgeModule,
  DwButtonModule,
  DwBreadCrumbModule,
  DwCalendarModule,
  DwCardModule,
  DwCarouselModule,
  DwCascaderModule,
  DwCheckboxModule,
  DwCollapseModule,
  DwCommentModule,
  DwDatePickerModule,
  DwDescriptionsModule,
  DwDividerModule,
  DwDrawerModule,
  DwDropDownModule,
  DwEmptyModule,
  DwFormModule,
  DwGridModule,
  DwI18nModule,
  DwIconModule,
  DwInputModule,
  DwInputNumberModule,
  DwLayoutModule,
  DwListModule,
  DwMentionModule,
  DwMenuModule,
  DwMessageModule,
  DwModalModule,
  DwNoAnimationModule,
  DwNotificationModule,
  DwPageHeaderModule,
  DwPaginationModule,
  DwPopconfirmModule,
  DwPopoverModule,
  DwProgressModule,
  DwRadioModule,
  DwRateModule,
  DwResultModule,
  DwSelectModule,
  DwSkeletonModule,
  DwSliderModule,
  DwSpinModule,
  DwStatisticModule,
  DwStepsModule,
  DwSwitchModule,
  DwTableModule,
  DwTabsModule,
  DwTagModule,
  DwTimePickerModule,
  DwTimelineModule,
  DwToolTipModule,
  DwTransButtonModule,
  DwTransferModule,
  DwTreeModule,
  DwTreeSelectModule,
  DwTypographyModule,
  DwUploadModule,
  DwWaveModule
];

export const agGridEditorsForAgGridComponents = DwAgGridEditorsModule.forAgGridComponents();

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // for layout
    FormsModule,
    ReactiveFormsModule,
    // NgQuicksilverModule,
    // TranslateModule,
    // DwLanguageModule,
    // DwIframeModule,
    // DwModalsModule,
    // DwIconElementModule,
    // DwFormItemsModule,
    // DwContainerModule,
    // DwDivMaskModule,
    // DwLoadingModule,
    // DwMainLayoutModule,
    // DwLoginModule,
    // agGridEditorsForAgGridComponents,
    // DwSsoLoginModule,
    // DwThemeButtonModule,
    // DwDateToStringModule,
    // DwTenantModule,
    // DwUserUiModule,
    // DwRoutingTabSetModule,
    // DwCronJobsModule,
    // FullCalendarModule
  ],
  providers: [
    {
      provide: DwLoggingService,
      useExisting: DwLoggingModalService // (放在 framework/components/exception 裡) => 綁 nz-zorro
    },
    {
      provide: DwHttpMessageService,  // (放在 framework/http/service) => 空的 => 要把 **-http-error-handle 裡用到的抽換掉
      useExisting: DwHttpMessageServiceModalService // (放在 framework/components/exception) => 綁 nz-zorro
    }
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ...QUICKSILVER_MODULE,
    DwLanguageModule,
    DwExceptionModule,
    DwActionModule,
    DwMenusModule,
    DwIframeModule,
    DwModalsModule,
    DwIconElementModule,
    DwFormItemsModule,
    DwContainerModule,
    DwDivMaskModule,
    DwLoadingModule,
    DwMainLayoutModule,
    DwLoginModule,
    DwAgGridEditorsModule,
    DwSsoLoginModule,
    DwThemeButtonModule,
    DwDateToStringModule,
    DwTenantModule,
    DwUserUiModule,
    DwRoutingTabSetModule,
    DwFinereportModule,
    DwCronJobsModule,
    FullCalendarModule,
    DwDevToolModule,
    DwProgramTitleModule,
    DwPagingModule,
    DwLanguageCoreModule
  ]
})
export class FrameworkUIModule {
  static forRoot(providers: Provider[] = []): ModuleWithProviders<FrameworkUIModule> {
    return {
      ngModule: FrameworkUIModule,
      providers: [
        ...DwRoutingTabSetCoreModule.forRoot().providers,
        ...DwLanguageCoreModule.forRoot().providers,
        ...providers
      ]
    };
  }
}
