export interface OriginDataModel {
  key: number;
  name: string;
  amount: number;
  status: boolean;
  update: string;
  address?: string;
  children?: OriginDataModel[];

}

export interface DataModel {
  key: number;
  name: string;
  amount: number;
  status?: boolean;
  update?: string;
  address?: string;
  children?: OriginDataModel[];
  parent?: DataModel;
  level?: number;
  expand?: boolean;
  checked?: boolean;

}
