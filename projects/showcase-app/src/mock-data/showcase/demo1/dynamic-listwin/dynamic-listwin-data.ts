export const demo1DynamicListwin = {
  'response': {
    'rowCount': 2,
    'pageCount': 1,
    'pageSize': 10,
    'currentPage': 1,
    'message': null,
    'success': true,
    'data': {
      'picklists': [
        {
          'name': 'DocSource04',
          'child': {
            'items': [
              { 'sequence': 1.0, 'id': '01', 'display_name': '来源1' },
              { 'sequence': 2.0, 'id': '02', 'display_name': '来源2' }
            ]
          }
        },
        {
          'name': 'DocSource05',
          'child': {
            'items': [
              { 'sequence': 1.0, 'id': 'S01', 'display_name': '来源S01' },
              { 'sequence': 2.0, 'id': 'S02', 'display_name': '来源S02' }]
          }
        }
      ],
      'fields': [
        {
          'visible': false,
          'picklist': null,
          'width': 150.0,
          'caption': '主键',
          'type': 'Guid',
          'field_name': 'EMP_ACCOUNTS_OBJECT_ID'
        },
        {
          'visible': true,
          'picklist': null,
          'width': 150.0,
          'caption': '借款单名称',
          'type': 'String',
          'field_name': 'OBJECT_TRANSDOC_NAME'
        },
        {
          'visible': true,
          'picklist': null,
          'width': 150.0,
          'caption': '借款单单号',
          'type': 'String',
          'field_name': 'OBJECT_TRANSDOC_NO'
        },
        {
          'visible': true,
          'picklist': null,
          'width': 150.0,
          'caption': '预计还款日',
          'type': 'Date',
          'field_name': 'PAYMENT_DATE'
        },
        {
          'visible': true,
          'picklist': null,
          'width': 150.0,
          'caption': '余额原币',
          'type': 'Decimal',
          'field_name': 'BALANCE_AMT_TC'
        },
        {
          'visible': true,
          'picklist': 'DocSource04',
          'width': 150.0,
          'caption': '单据来源',
          'type': 'Integer',
          'field_name': 'DOC_RTK'
        }
      ],
      'rows': [
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 12.63,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13380',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529000',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单0',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 13.63,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13381',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529001',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单1',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 14.63,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13382',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529002',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单2',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 15.63,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13383',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529003',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单3',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 16.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13384',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529004',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单4',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 17.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13385',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529005',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单5',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 18.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13386',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529006',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单6',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 19.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13387',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529007',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单7',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 20.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13388',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529008',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单8',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 21.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d13389',
          'OBJECT_TRANSDOC_NO': '00277E01-20180529009',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单9',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 22.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133810',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290010',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单10',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 23.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133811',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290011',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单11',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 24.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133812',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290012',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单12',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 25.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133813',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290013',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单13',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 26.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133814',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290014',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单14',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 27.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133815',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290015',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单15',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 28.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133816',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290016',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单16',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 29.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133817',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290017',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单17',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '01',
          'BALANCE_AMT_TC': 30.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133818',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290018',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单18',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 31.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133819',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290019',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单19',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        },
        {
          'DOC_RTK': '02',
          'BALANCE_AMT_TC': 33.630000000000003,
          'EMP_ACCOUNTS_OBJECT_ID': 'c585efad-7cfd-467c-8c1d-551d445d133819',
          'OBJECT_TRANSDOC_NO': '00277E01-201805290020',
          'OBJECT_TRANSDOC_NAME': '0027员工借款单20',
          'PAYMENT_DATE': '2018/10/24 14:05:02'
        }
      ],
      'items': [],
      'keyInfo': [{
        'value_field': 'EMP_ACCOUNTS_OBJECT_ID',
        'display_field': 'OBJECT_TRANSDOC_NAME'
      }]
    }
  }
};
