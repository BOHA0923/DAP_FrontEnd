const i18ntw = require('../assets/i18n/zh_TW/basic.json');
const i18ncn = require('../assets/i18n/zh_CN/basic.json');
const i18nen = require('../assets/i18n/en_US/basic.json');

import { heroes } from './showcase/heroes';
import { demo1OrderList } from './showcase/demo1/demo1-order-list';
import { demo1OrderDetail } from './showcase/demo1/demo1-order-detail';
import { demo1OrderModify } from './showcase/demo1/demo1-order-modify';
import { demo1GroupList } from './showcase/demo1/demo1-group-list';
import { demo1DeleteGroupList } from './showcase/demo1/demo1-group-list-delete';
import { demo1GroupDetail } from './showcase/demo1/demo1-group-detail';
import { demo1GroupModify } from './showcase/demo1/demo1-group-modify';
import { demo1GroupAdd } from './showcase/demo1/demo1-group-add';
import { demo1AsisList } from './showcase/demo1/asis/demo1-asis-list';
import { demo1AsisListDelete } from './showcase/demo1/asis/demo1-asis-list-delete';
import { demo1AsisDetail } from './showcase/demo1/asis/demo1-asis-detail';
import { demo1AsisModify } from './showcase/demo1/asis/demo1-asis-modify';
import { demo1AsisAdd } from './showcase/demo1/asis/demo1-asis-add';
import { demo1Employee } from './showcase/demo1/demo1-employee';
import { demo1Customer } from './showcase/demo1/demo1-customer';
import { demo1GridsterList } from './showcase/demo1/demo1-gridster';
import { demo1TreeMenu } from './showcase/demo1/tree-menu/demo1-tree-menu';
import { demo1TreeDetail } from './showcase/demo1/tree-menu/demo1-tree-detail';
import { demo1TreeModify } from './showcase/demo1/tree-menu/demo1-tree-modify';
import { demo1DeleteTreeList } from './showcase/demo1/tree-menu/demo1-tree-list-delete';
import { demo1TreeAdd } from './showcase/demo1/tree-menu/demo1-tree-add';
import { demo1DynamicListwinData } from './showcase/demo1/dynamic-listwin/dynamic-listwin';
import { demo2InputListwinData } from './showcase/demo2/input-listwin/input-listwin';
import { demo1DocumentOrder } from './showcase/demo1/document-order/document-order';
import { agGridMock } from './showcase/demo2/ag-grid-mock';
import { demo2InputListwinEnumData } from './showcase/demo2/input-listwin/input-listwin-enum';

export const mockDB = {};

mockDB['assets/i18n/zh_TW/basic'] = i18ntw;
mockDB['assets/i18n/zh_CN/basic'] = i18ncn;
mockDB['assets/i18n/en_US/basic'] = i18nen;

mockDB['showcase/Hero/getHeroes'] = heroes.data;
mockDB['showcase/demo1/getOrderList'] = demo1OrderList.data;
mockDB['showcase/demo1/getOrderDetail'] = demo1OrderDetail.data;
mockDB['showcase/demo1/modifyOrder'] = demo1OrderModify.data;
mockDB['showcase/demo1/getGroupList'] = demo1GroupList.data;
mockDB['showcase/demo1/deleteGroupList'] = demo1DeleteGroupList.data;
mockDB['showcase/demo1/getGroupDetail'] = demo1GroupDetail.data;
mockDB['showcase/demo1/modifyGroup'] = demo1GroupModify.data;
mockDB['showcase/demo1/addGroup'] = demo1GroupAdd.data;
mockDB['showcase/demo1/getAsisList'] = demo1AsisList.data;
mockDB['showcase/demo1/deleteAsisList'] = demo1AsisListDelete.data;
mockDB['showcase/demo1/getAsisDetail'] = demo1AsisDetail.data;
mockDB['showcase/demo1/modifyAsis'] = demo1AsisModify.data;
mockDB['showcase/demo1/addAsis'] = demo1AsisAdd.data;
mockDB['showcase/demo1/getEmployee'] = demo1Employee.data;
mockDB['showcase/demo1/getCustomers'] = demo1Customer.data;
mockDB['showcase/demo1/getGridster'] = demo1GridsterList.data;
mockDB['showcase/demo1/tree-menu/getTreeMenu'] = demo1TreeMenu.data;
mockDB['showcase/demo1/tree-menu/getTreeDetail'] = demo1TreeDetail.data;
mockDB['showcase/demo1/tree-menu/modifyTree'] = demo1TreeModify.data;
mockDB['showcase/demo1/tree-menu/deleteTreeList'] = demo1DeleteTreeList.data;
mockDB['showcase/demo1/tree-menu/addTree'] = demo1TreeAdd.data;
mockDB['showcase/demo1/dynamic-listwin/getDynamicListwinData'] = demo1DynamicListwinData.data;
mockDB['showcase/demo2/input-listwin/getInputListwinData'] = demo2InputListwinData.data;
// mockDB['DEMO_DAP_CURRENT/DemoOrder/List'] = demo1DocumentOrder.data;
// mockDB['DEMO_DAP_CURRENT/DemoOrder'] = demo1DocumentOrder.data;
mockDB['showcase/demo2/ag-grid/grid-data'] = agGridMock.data;
mockDB['showcase/demo2/ag-grid/grid-large-data'] = agGridMock.largeData;
mockDB['showcase/demo2/input-listwin/getInputListwinEnumData'] = demo2InputListwinEnumData.data;

export const requestMethodImpl = {};
// requestMethodImpl['DEMO_DAP_CURRENT/DemoOrder/List'] = {
//   get: demo1DocumentOrder.getList,
//   post: demo1DocumentOrder.postMethod,
//   delete: demo1DocumentOrder.deleteMethod,
//   put: demo1DocumentOrder.putMethod
// };
// requestMethodImpl['DEMO_DAP_CURRENT/DemoOrder'] = {
//   get: demo1DocumentOrder.getMethod,
//   post: demo1DocumentOrder.postMethod,
//   delete: demo1DocumentOrder.deleteMethod,
//   put: demo1DocumentOrder.putMethod
// };
requestMethodImpl['showcase/Hero/getHeroes'] = {
  get: heroes.getMethod,
  post: heroes.postMethod,
  delete: heroes.deleteMethod,
  put: heroes.putMethod
};
requestMethodImpl['showcase/demo1/getOrderList'] = {
  get: demo1OrderList.getMethod,
  post: demo1OrderList.postMethod,
  delete: demo1OrderList.deleteMethod,
  put: demo1OrderList.putMethod
};
requestMethodImpl['showcase/demo1/getOrderDetail'] = {
  get: demo1OrderDetail.getMethod,
  post: demo1OrderDetail.postMethod,
  delete: demo1OrderDetail.deleteMethod,
  put: demo1OrderDetail.putMethod
};
requestMethodImpl['showcase/demo1/modifyOrder'] = {
  post: demo1OrderModify.postMethod
};

requestMethodImpl['showcase/demo1/getGroupList'] = {
  get: demo1GroupList.getMethod,
  post: demo1GroupList.postMethod,
  delete: demo1GroupList.deleteMethod,
  put: demo1GroupList.putMethod
};
requestMethodImpl['showcase/demo1/deleteGroupList'] = {
  post: demo1DeleteGroupList.postMethod,
};
requestMethodImpl['showcase/demo1/getGroupDetail'] = {
  get: demo1GroupDetail.getMethod,
  post: demo1GroupDetail.postMethod,
  delete: demo1GroupDetail.deleteMethod,
  put: demo1GroupDetail.putMethod
};
requestMethodImpl['showcase/demo1/modifyGroup'] = {
  post: demo1GroupModify.postMethod
};
requestMethodImpl['showcase/demo1/addGroup'] = {
  post: demo1GroupAdd.postMethod
};

requestMethodImpl['showcase/demo1/getAsisList'] = {
  get: demo1AsisList.getMethod,
  post: demo1AsisList.postMethod,
  delete: demo1AsisList.deleteMethod,
  put: demo1AsisList.putMethod
};
requestMethodImpl['showcase/demo1/deleteAsisList'] = {
  post: demo1AsisListDelete.postMethod,
};
requestMethodImpl['showcase/demo1/getAsisDetail'] = {
  get: demo1AsisDetail.getMethod,
  post: demo1AsisDetail.postMethod,
  delete: demo1AsisDetail.deleteMethod,
  put: demo1AsisDetail.putMethod
};
requestMethodImpl['showcase/demo1/modifyAsis'] = {
  post: demo1AsisModify.postMethod
};
requestMethodImpl['showcase/demo1/addAsis'] = {
  post: demo1AsisAdd.postMethod
};

requestMethodImpl['showcase/demo1/getEmployee'] = {
  post: demo1Employee.postMethod
};
requestMethodImpl['showcase/demo1/getCustomers'] = {
  post: demo1Customer.postMethod
};

requestMethodImpl['showcase/demo1/getGridster'] = {
  post: demo1GridsterList.postMethod
};

requestMethodImpl['showcase/demo1/tree-menu/getTreeMenu'] = {
  post: demo1TreeMenu.postMethod
};

requestMethodImpl['showcase/demo1/tree-menu/getTreeDetail'] = {
  post: demo1TreeDetail.postMethod
};

requestMethodImpl['showcase/demo1/tree-menu/modifyTree'] = {
  post: demo1TreeModify.postMethod
};

requestMethodImpl['showcase/demo1/tree-menu/deleteTreeList'] = {
  post: demo1DeleteTreeList.postMethod,
};

requestMethodImpl['showcase/demo1/tree-menu/addTree'] = {
  post: demo1TreeAdd.postMethod
};

requestMethodImpl['showcase/demo1/dynamic-listwin/getDynamicListwinData'] = {
  get: demo1DynamicListwinData.getMethod,
  post: demo1DynamicListwinData.postMethod
};

requestMethodImpl['showcase/demo2/input-listwin/getInputListwinData'] = {
  post: demo2InputListwinData.postMethod
};

requestMethodImpl['showcase/demo2/ag-grid/grid-data'] = {
  get: agGridMock.getMethod,
  post: agGridMock.postMethod
};

requestMethodImpl['showcase/demo2/ag-grid/grid-large-data'] = {
  get: agGridMock.getMethod,
  post: agGridMock.postMethod
};

requestMethodImpl['showcase/demo2/input-listwin/getInputListwinEnumData'] = {
  post: demo2InputListwinEnumData.postMethod
};
