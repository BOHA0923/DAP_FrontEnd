import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwOrgTreeNode, IDwOrgTreeDataMode, IDwOrgTreeDefault, DW_ORGTREE_MODAL_DEFAULT } from './organize-tree.interface';
import { DwOrganizeTreeCoreModule } from './organize-tree-core.module';


@Injectable({
  providedIn: DwOrganizeTreeCoreModule
})
export class DwOrganizeTreeService {
  protected _cache = {};

  private _fullNodesRoot: IDwOrgTreeNode[] = [{
    type: 'org',
    id: 'A00001',
    sid: 100001,
    title: '鼎捷（南京）',
    children: [
      {
        type: 'org',
        id: 'AA0001',
        title: '服務部',
        sid: 100002
      },
      {
        type: 'org',
        id: 'AB0001',
        title: '開發部',
        sid: 100003,
        children: [{
          type: 'org',
          id: 'ABA001',
          title: '開發組',
          sid: 100011,
          children: [{
            type: 'user',
            id: 'ABA001',
            title: '沈海',
            sid: 100001
          }, {
            type: 'user',
            id: 'ABA002',
            title: '江河',
            sid: 100006
          }]
        },
        {
        type: 'org',
        id: 'ABA002',
        title: '測試組',
        sid: 100012,
        children: [{
          type: 'user',
          key: 'ABA005',
          title: '湖月',
          sid: 100007
        }]
      }, {
        type: 'user',
        id: 'ABA003',
        title: '汪洋',
        sid: 100005
      }]
      },
      {
        type: 'org',
        id: 'AC0002',
        title: '應用部',
        sid: 100004,
        children: [
          {
            type: 'user',
            id: 'AC0001',
            title: '李志江',
            sid: 100002,
          },
          {
            type: 'user',
            id: 'AC0002',
            title: '李斌',
            sid: 100003
          }, {
            type: 'user',
            id: 'AC0003',
            title: '王欣',
            sid: 100004
          }
        ]
      }
    ]
  }];


  private _fullNodes: IDwOrgTreeNode[] = [{
    type: 'org',
    id: 'AA0001',
    title: '服務部',
    sid: 100002
    },
    {
      type: 'org',
      id: 'AB0001',
      title: '開發部',
      sid: 100003,
      children: [
      {
        type: 'org',
        id: 'ABA001',
        title: '開發組',
        sid: 100011,
        children: [{
          type: 'user',
          id: 'ABA001',
          title: '沈海',
          sid: 100001
        }, {
          type: 'user',
          id: 'ABA002',
          title: '江河',
          sid: 100006
        }]
      },
      {
      type: 'org',
      id: 'ABA002',
      title: '測試組',
      sid: 100012,
      children: [{
        type: 'user',
        id: 'ABA005',
        title: '湖月',
        sid: 100007
      }]
    }, {
      type: 'user',
      id: 'ABA003',
      title: '汪洋',
      sid: 100005
    }]
  },
  {
    type: 'org',
    id: 'AC0002',
    title: '應用部',
    sid: 100004,
    children: [
      {
        type: 'user',
        id: 'AC0001',
        title: '李志江',
        sid: 100002,
      },
      {
        type: 'user',
        id: 'AC0002',
        title: '李斌',
        sid: 100003
      }, {
        type: 'user',
        id: 'AC0003',
        title: '王欣',
        sid: 100004
      }
    ]
  }];


  private _orgNodes: IDwOrgTreeNode[] = [{
    type: 'org',
    id: 'A00001',
    sid: 100001,
    title: '鼎捷（南京）',
    children: [
      {
        type: 'org',
        id: 'AA0001',
        title: '服務部',
        sid: 100002
      },
      {
        type: 'org',
        id: 'AB0001',
        title: '開發部',
        sid: 100003,
        children: [{
          type: 'org',
          id: 'ABA001',
          title: '開發組',
          sid: 100011,
          children: []
        },
        {
        type: 'org',
        id: 'ABA002',
        title: '測試組',
        sid: 100012
      }]
      },
      {
        type: 'org',
        id: 'AC0002',
        title: '應用部',
        sid: 100004,
        children: []
      }
    ]
  }];

  constructor(
    @Inject(DW_ORGTREE_MODAL_DEFAULT) protected openOrgTreeModalDefault: IDwOrgTreeDefault<any>
  ) {

  }

  /**
   * 虛擬的根節點.
   *
   */
  protected getVirtualRootnode(): IDwOrgTreeNode {
    return Object.assign({}, {
      type: 'root',
      key: null,
      title: null,
      sid: null,
      parentKey: null,
      parentTitle: null,
      parentSid: null,
      children : []
    });
  }
    /**
   * 同階層依sortType值為優先排序
   *
   */
  protected sortFn = (a: IDwOrgTreeNode, b: IDwOrgTreeNode, sortType: string): number => {
    if (a.type === sortType && b.type !== sortType) {
      return -1;
    }
    if (a.type !== sortType && b.type === sortType) {
      return 1;
    }
    return 0;
  }

  /**
   * 掃瞄整棵樹, 為每一個節點增加屬性.
   *
   */
  protected initTreeDatas(config: IDwOrgTreeDataMode, datas: IDwOrgTreeNode[]): IDwOrgTreeNode[] {
    // 使用原始結構進行加工.
    const _datas = JSON.parse(JSON.stringify(datas));

    // 虛擬加上一個根節點當父節點.
    const root = this.getVirtualRootnode();
    root.children.push(..._datas);
    root.children.sort((a: IDwOrgTreeNode, b: IDwOrgTreeNode): number => {
      return this.sortFn(a, b, config.sortType);
    });
    root.children.forEach(node => {
      this.initNode(config, node, root);
    });

    return root.children;
  }


  /**
   * 為每一個節點增加屬性.
   *
   */
  protected initNode(config: IDwOrgTreeDataMode, node: IDwOrgTreeNode, parentNode: IDwOrgTreeNode): void {
    // 節點的基本資料
    Object.assign(node, {
      sid: node.sid.toString(),
      key: this.initNodeKey(config, node, parentNode),
      parentKey: parentNode.key,
      parentTitle: parentNode.title,
      parentSid: (parentNode.sid) ? parentNode.sid.toString() : parentNode.sid,
      expanded: (node.hasOwnProperty('expanded')) ? node.expanded : config.expandAll, // 以 node 有 expanded 為優先, 如果不存在取設定值 expandAll.
      isLeaf: false
    });

    // 可以選取的節點, full: 組織+人 或 user:人, 預設 full, 必須依賴dataType=full.
    if (node.type === 'org' && config.dataType === 'full' && config.selectType === 'user') {
      Object.assign(node, {
        disabled: true
      });
    }

    // 組織沒有子節點, 設定為不展開並為葉節點.
    if (node.type === 'org' && (!node.hasOwnProperty('children') || node.children.length === 0)) {
      Object.assign(node, {
        expanded: false,
        isLeaf: true
      });
    }

    // 人員設定為不展開並為葉節點.
    if (node.type === 'user') {
      Object.assign(node, {
        expanded: false,
        icon: 'user',
        isLeaf: true
      });
    }

    if (node.hasOwnProperty('children') && node.children.length > 0) {
      node.children.sort((a: IDwOrgTreeNode, b: IDwOrgTreeNode): number => {
        return this.sortFn(a, b, config.sortType);
      });
      for (let i = 0 ; i < node.children.length; i++) {
        this.initNode(config, node.children[i], node);
      }
    }

  }


  /**
   * 節點新的 key.
   *
   */
  protected initNodeKey(config: IDwOrgTreeDataMode, node: IDwOrgTreeNode, parentNode: IDwOrgTreeNode): string {
    const _key = (config.keyType === 'id') ? node.id : node.sid;
    // org key 的 prefix 使用 node.sid, user 的 prefix 使用 node.parentSid.
    const _prefix = (node.type === 'org') ? node.sid : parentNode.sid;
    return node.type + _prefix + '-' + _key;
  }


  /**
   * 設定組織人員樹的 cache.
   *
   */
  protected setCache(config: IDwOrgTreeDataMode, datas: IDwOrgTreeNode[]): void {
    const _config = this.getTreeDataMode(config);
    const _datas = this.initTreeDatas(_config, datas);
    const _cacheKey = this.getCacheKeys(_config);

    this._cache[_cacheKey] = _datas;
  }


  /**
   * 取得組織人員樹的 cache.
   *
   */
  protected getCache(config: IDwOrgTreeDataMode): IDwOrgTreeNode[] {
    const _config = this.getTreeDataMode(config);
    const _cacheKey = this.getCacheKeys(_config);

    if (this._cache[_cacheKey]) {
      return this._cache[_cacheKey];
    }

    return [];
  }


  /**
   * 取得組織樹資料.
   *
   */
  getOrganizeTree(config: IDwOrgTreeDataMode): Observable<any> {
    return new Observable((observer): void => {
      const _cache = this.getCache(config);
      if (_cache.length > 0 )  {
        observer.next(_cache);
        observer.complete();
        return;
      }

      const nodes = (config.dataType === 'full') ? this._fullNodes : this._orgNodes;
      this.setCache(config, nodes);

      // 需回傳已經加工過的 treeData.
      observer.next(this.getCache(config));
      observer.complete();
    });

  }


  /**
   * 使用節點的 type + key + parentSid 組成 新key, 成為唯一值.
   *
   */
  protected getCombinedKey(node: IDwOrgTreeNode, isParentKey: boolean = false): string {
    let _useKey = node.key;
    let _useType = node.type;
    // org key 的 prefix 使用 node.sid, user 的 prefix 使用 node.parentSid.
    let _prefix = (_useType === 'org') ? node.sid : node.parentSid;

    // 當組父節點的 key 時, key 用 parentKey, type 使用 org.
    // 人員的parent type 預定是 org, 如果parent type 可能是 user 時, node 需增加 parentType.
    if (isParentKey) {
      _useKey = node.parentKey;
      _prefix = node.parentSid; // 組父節點時, _prefix 要使用 parentSid.
      _useType = 'org';
    }

    return (_useKey) ? _useType + _prefix + '-' + _useKey : _useKey;
  }


  /**
   * 還原 key 值.
   *
   */
  replaceKey(_key: string): string {
    if (!_key) {
      return _key;
    }

    const _theKey = _key.split('-');
    return _theKey[1];
  }


  /**
   * 取得參數datas裡的 keys.
   *
   */
  getKeys(datas: IDwOrgTreeNode[]): Array<string> {
    const ret = [];
    if (datas.length === 0) {
      return ret;
    }

    datas.forEach(node => {
      ret.push(this.getCombinedKey(node));
    });

    return ret;
  }


  /**
   * 取得樹控件的資料型態.
   *
   */
  protected getTreeDataMode(config: IDwOrgTreeDataMode): IDwOrgTreeDataMode {
    return Object.assign({}, {
      dataType: this.openOrgTreeModalDefault.treeDataType,
      keyType: this.openOrgTreeModalDefault.treeKeyType,
      selectType: this.openOrgTreeModalDefault.treeSelectType,
      expandAll: this.openOrgTreeModalDefault.treeExpandAll
    }, config);

  }


  /**
   * 依節點, 取得清單-可能存在未開窗就要取值時.
   *
   */
  getNodeLists(datas: IDwOrgTreeNode[], config: IDwOrgTreeDataMode = {}): Observable<any> {
    const _config = this.getTreeDataMode(config);
    return new Observable((observer): void => {
      if (!datas || datas.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }

      this.getOrganizeTree(_config).subscribe(
        (nodes) => {
          const matches = this.getMatchNodes(datas, nodes);
          observer.next(this.convertToList(matches));
          observer.complete();
      });

    });
  }


  /**
   * 取出選取的節點-從root往下找,取得符合的節點.
   *
   */
  getMatchNodes(datas: IDwOrgTreeNode[], nodes: IDwOrgTreeNode[]): IDwOrgTreeNode[] {
    const stack: IDwOrgTreeNode[] = []; // 所有的節點.
    const matches: IDwOrgTreeNode[] = []; // 符合的節點.
    const _nodes: IDwOrgTreeNode[] = JSON.parse(JSON.stringify(nodes));
    const _keys: string[] = this.getKeys(datas);

    stack.push(..._nodes);

    while (stack.length !== 0) {
      const node = stack.pop();
      // 符合的節點.
      const idx = _keys.indexOf(node.key);
      if (idx >= 0) {
        matches.push(node);
      }

      if (node.hasOwnProperty('children') && node.children.length > 0) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i]);
        }
      }
    }

    return matches;
  }


  /**
   * 將樹形結構轉換成列表-從root往下找.
   *
   */
  convertToList(root: IDwOrgTreeNode[]): IDwOrgTreeNode[] {
    const stack: IDwOrgTreeNode[] = []; // 所有的節點.
    const array: IDwOrgTreeNode[] = []; // 符合的節點.

    stack.push(...root);

    while (stack.length !== 0) {
      const node = stack.pop();

      array.push(this.getNodeOriginValue(node));

      if (node.hasOwnProperty('children') && node.children.length > 0) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i]);
        }
      }
    }

    return array;
  }


  /**
   * 將convertToList()的結果列表, 轉換樹狀結構.
   *
   */
  convertedTotree(datas: IDwOrgTreeNode[]): IDwOrgTreeNode[] {
    const opDatas = JSON.parse(JSON.stringify(datas));

    // 重新指定節點的 key 與 parentKey
    opDatas.forEach((item: IDwOrgTreeNode) => {
      Object.assign(item, {
        key: this.getCombinedKey(item),
        parentKey: this.getCombinedKey(item, true)
      });
    });


    const map = [];
    const roots = [];

    for (let i = 0; i < opDatas.length; i++) {
      map[opDatas[i].key] = i;     // initialize the map
      if (opDatas[i].type === 'org') {
        opDatas[i].children = []; // initialize the children
      }
    }

    for (let i = 0; i < opDatas.length; i++) {
      const node = opDatas[i];
      if (node.parentKey && (map[node.parentKey] !== undefined) && node.parentKey !== node.key) {
        opDatas[map[node.parentKey]].children.push(node);
      } else {
        roots.push(node);
      }
    }

    return this.convertedtreeDatas(roots);
  }


  /**
   * 還原節點的 key
   *
   */
  protected convertedtreeDatas(datas: IDwOrgTreeNode[]): IDwOrgTreeNode[] {
    // 虛擬加上一個根節點當父節點.
    const root = this.getVirtualRootnode();
    root.children.push(...datas);

    root.children.forEach(node => {
      this.convertedtreeNode(node);
    });

    return root.children;
  }


  /**
   * 還原節點的 key
   *
   */
  protected convertedtreeNode(node: IDwOrgTreeNode): void {
    Object.assign(node, {
      key: this.replaceKey(node.key),
      parentKey: this.replaceKey(node.parentKey)
    });
    if (node.hasOwnProperty('children') && node.children.length > 0) {
      for (let i = 0 ; i < node.children.length; i++) {
        this.convertedtreeNode(node.children[i]);
      }
    }

  }


  /**
   * 取得 node 的原始資料.
   *
   */
  getNodeOriginValue(node: IDwOrgTreeNode): IDwOrgTreeNode {
    return Object.assign({}, {
      type: node.type,
      key: this.replaceKey(node.key),
      title: node.title,
      id: node.id,
      sid: node.sid,
      parentKey: this.replaceKey(node.parentKey),
      parentTitle: node.parentTitle,
      parentSid: node.parentSid
    });
  }


  /**
   * 清除cache.
   *
   */
  protected resetCache(): void {
    this._cache = {};
  }


  /**
   * 開窗時提供 reload cache.
   *
   */
  reloadCache(config: IDwOrgTreeDataMode): Observable<any> {
    this.resetCache();

    this._fullNodes = this._fullNodesRoot;
    return this.getOrganizeTree(config);
  }


  /**
   * 取得 catch 的 key.
   *
   */
  protected getCacheKeys(config: IDwOrgTreeDataMode): string {
    return config.dataType +
      '-' + config.keyType +
      '-' + config.selectType +
      '-' + config.expandAll.toString();
  }


  /**
   * 設定樹節點展開-從root往下找,取得符合的節點.
   *
   */
  setExpandTreeNodes(treeNodes: {level: number, children: any[], isExpanded: boolean}[], expandLevel: number): void {
    const stack: any[] = []; // 所有的節點.
    stack.push(...treeNodes);

    while (stack.length !== 0) {
      const node = stack.pop();
      // 符合的節點.
      if (+node.level <= +expandLevel) {
        node.isExpanded = true;
      }

      if (node.hasOwnProperty('children') && node.children.length > 0) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i]);
        }
      }
    }

  }
}
