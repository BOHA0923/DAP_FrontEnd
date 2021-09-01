export const menuData = [
  {
    'id': 'dw-demo1',
    'type': 'category',
    'iconClass': 'dwType:heart dwTheme:fill',
    'child': [
      {
        'id': 'dw-order',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-order'
      },
      {
        'id': 'dw-document-order',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-document-order'
      },
      {
        'id': 'dw-group',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-group'
      },
      {
        'id': 'dw-asis',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-asis'
      },
      {
        'id': 'dw-tree',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-tree'
      },
      {
        'id': 'dw-tree-menu',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-tree-menu'
      },
      {
        'id': 'dw-gridster',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-gridster'
      },
      {
        'id': 'dw-dynamic-listwin',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-dynamic-listwin'
      },
      {
        'id': 'dw-account-info',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-account-info'
      },
      {
        'id': 'dw-demo-calendar',
        'type': 'program',
        'iconClass': 'dwType:calendar',
        'programId': 'dw-demo-calendar'
      }
      // {
      //   'id': 's-sampleApp1-equipment-frm',
      //   'type': 'fineReport',
      //   'iconClass': 'dwType:chrome',
      //   'programId': 's-sampleApp1-equipment-frm',
      //   'parameter':  [
      //     {
      //       'name': 'actrulData',
      //       'value': '99.5'
      //     },
      //     {
      //       'name': 'lastMachineKeep',
      //       'value': '59.0'
      //     },
      //     {
      //       'name': 'machineOutKeep',
      //       'value': '29.0'
      //     }
      //   ]
      // },
      // {
      //   'id': 'dw-equipment-param',
      //   'type': 'fineReport',
      //   'iconClass': 'dwType:chrome',
      //   'programId': 's-sampleApp1-equipment-frm',
      //   'parameter':  [
      //     {
      //       'name': 'actrulData',
      //       'value': '111'
      //     },
      //     {
      //       'name': 'lastMachineKeep',
      //       'value': '222'
      //     },
      //     {
      //       'name': 'machineOutKeep',
      //       'value': '333'
      //     }
      //   ]
      // }
    ]
  },
  {
    'id': 'dw-demo2',
    'type': 'category',
    'iconClass': 'dwType:heart',
    'child': [
      {
        'id': 'dw-mock-demo',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-mock-demo'
      },
      {
        'id': 'dw-messages',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-messages'
      },
      {
        'id': 'dw-input-listwin',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-input-listwin'
      },
      {
        'id': 'dw-form-items',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-form-items'
      },
      {
        'id': 'dw-demo-theme',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-demo-theme'
      },
      {
        'id': 'dw-language-style',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-language-style'
      },
      {
        'id': 'dw-ag-grid-editing',
        'type': 'program',
        'iconClass': 'dwType:table',
        'programId': 'dw-ag-grid-editing'
      },
      {
        'id': 'dw-pagination',
        'type': 'category',
        'iconClass': 'dwType:table',
        'child': [
          {
            'id': 'dw-pagination-ag-grid-cs',
            'type': 'program',
            'iconClass': 'dwType:table',
            'programId': 'dw-pagination-ag-grid-cs'
          },
          {
            'id': 'dw-pagination-ag-grid',
            'type': 'program',
            'iconClass': 'dwType:table',
            'programId': 'dw-pagination-ag-grid'
          },
          {
            'id': 'dw-pagination-table',
            'type': 'program',
            'iconClass': 'dwType:table',
            'programId': 'dw-pagination-table'
          }
        ]
      },
      {
        'id': 'dw-organize-tree',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-organize-tree'
      },
      {
        'id': 'dw-update-password',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-update-password'
      },
      {
        'id': 'dw-job-schedule',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-job-schedule'
      },
      {
        'id': 'dw-demo-image-viewer',
        'type': 'program',
        'iconClass': 'dwType:chrome',
        'programId': 'dw-demo-image-viewer'
      }
    ]
  },
  {
    'id': 'dw-doc',
    'type': 'category',
    'open': true,
    'iconClass': 'dwType:book',
    'child': [
      {
        'id': 'dw-doc-typescript',
        'type': 'externalUrl',
        'iconClass': '',
        'url': 'https://www.typescriptlang.org/docs/home.html',
        'openMode': 'window'
      },
      {
        'id': 'dw-doc-angular',
        'type': 'externalUrl',
        'iconClass': '',
        'url': 'https://angular.io/docs',
        'openMode': 'iframe'
      },
      {
        'id': 'dw-doc-ng-quicksilver',
        'type': 'externalUrl',
        'iconClass': '',
        'url': 'http://webdpt.10.40.41.143.xip.io:10080/ng-quicksilver-src',
        'openMode': 'window'
      },
      {
        'id': 'dw-url-digiwin',
        'type': 'externalUrl',
        'iconClass': '',
        'url': 'https://www.digiwin.com',
        'openMode': 'iframe'
      }
    ]
  }
];
