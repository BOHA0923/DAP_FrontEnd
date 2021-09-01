export class DwQueryOrder {
  constructor(public name: string, public orderby: string) {
  }
}

export class DwQueryConditionInfo {
  public name: string;
  public values?: string[];
  public value?: string;
  public operator: string;
  constructor(name: string, value: string | string[], operator: string) {
    this.name = name;
    this.operator = operator;

    if (Array.isArray(value)) {
      this.values = value;
    } else {
      this.value = value;
    }
  }
}

export enum DwQueryConditionOperator {
  IN = 'IN',
  AND = 'AND',
  OR = 'OR',
  LIKE = 'LIKE',
  EQUAL = 'EQUAL',
  NOTEQUALS = 'NotEquals',
  LESSTHAN = 'LessThan',
  LESSTHANOREQUALTO = 'LessThanOrEqualTo',
  GREATERTHAN = 'GreaterThan',
  GREATERTHANOREQUALTO = 'GreaterThanOrEqualTo',
  BETWEEN = 'Between'
}

export class DwQueryCondition {
  public items: (DwQueryConditionInfo | DwQueryCondition)[] = [];
  constructor(public joinOperator: string = DwQueryConditionOperator.AND) { }

  public addCondition(condition: DwQueryConditionInfo | DwQueryCondition): void {
    this.items.push(condition);
  }

  public clearValue(): void {
    this.items.forEach(item => {
      if ('value' in item) {
        item.value = '';
        // item.values.splice(0, item.values.length);
      } else if ('values' in item) {
        item.values.splice(0, item.values.length);
      } else if (item instanceof DwQueryCondition) {
        item.clearValue();
      }
    });
  }
}

export class DwQueryInfo {
  pageable: boolean = true;
  pageSize: number = 20;
  pageNumber: number = 1;
  orderfields: { [key: string]: DwQueryOrder };
  conditionField: { [key: string]: DwQueryConditionInfo };
  condition: DwQueryCondition;

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

    return value;
  }

  constructor() {
    this.condition = null;
    this.conditionField = {};
    this.orderfields = {};
  }

  setCondition(condition: DwQueryCondition): void {
    this.condition = condition;
  }

  addConditionField(item: DwQueryConditionInfo): void {
    this.conditionField[item.name] = item;
  }

  addOrderfield(order: DwQueryOrder): void {
    console.error('addOrderfield will deprecated. it was superseded by the addOrderField');
    this.addOrderField(order);
  }

  addOrderField(order: DwQueryOrder): void {
    this.orderfields[order.name] = order;
  }

  removeOrderField(fieldName: string): void {
    if (fieldName && this.orderfields[fieldName]) {
      delete this.orderfields[fieldName];
    }
  }

  clearOrderField(): void {
    this.orderfields = {};
  }

  clearConditionValue(): void {
    this.condition.clearValue();
  }

  clear(): void {
    this.pageNumber = 1;
    this.pageSize = 20;
    this.orderfields = {};
    this.condition = null;
    this.conditionField = {};
  }
}
