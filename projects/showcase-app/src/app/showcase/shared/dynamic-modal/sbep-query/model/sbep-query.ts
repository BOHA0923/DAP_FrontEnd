import { DwQueryInfo, DwQueryCondition } from '@webdpt/framework/document';

export class SbepQueryInfo extends DwQueryInfo {
  selectWindowId: string;

  constructor() {
    super();
  }

  getRawValue(): any {
    const value = {};
    if (this.pageable) { Object.assign(value, { pageSize: this.pageSize, pageNumber: this.pageNumber }); }

    const localCondition = new DwQueryCondition();
    for (const field of Object.values(this.conditionField)) {
      localCondition.addCondition(field);
    }

    if (this.condition && this.condition.items.length > 0) {
      localCondition.addCondition(this.condition);
    }

    Object.assign(value, {
      orderfields: Object.values(this.orderfields),
      condition: localCondition
    });

    Object.assign(value, {
      selectWindowId: this.selectWindowId
    });

    return value;
  }

}
