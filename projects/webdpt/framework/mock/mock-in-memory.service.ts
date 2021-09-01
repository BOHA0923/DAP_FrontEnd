import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import {
  InMemoryDbService,
  ParsedRequestUrl,
  RequestInfo,
  RequestInfoUtilities,
  ResponseOptions,
  STATUS
} from 'angular-in-memory-web-api';

import { DW_MOCK } from '@webdpt/framework/config';
import { DwSystemConfigService } from '@webdpt/framework/config';


/**
 * 模擬資料內存服務器
 *
 * @export
 */
@Injectable()
export class DwMockInMemoryService implements InMemoryDbService {

  private _db: any;
  private _methods: any;
  private appApiUrl: string;
  constructor(
    @Inject(DW_MOCK) private mock: any,
    private configService: DwSystemConfigService
  ) {
    this._db = mock.db;
    this._methods = mock.methods;
    this.configService.get('apiUrl').subscribe(
      url => this.appApiUrl = url
    );
  }


  /**
   *
   * Interface for the result of the `parseRequestUrl` method:
   *   Given URL "http://localhost:8080/api/customers/42?foo=1 the default implementation returns
   *     base: 'api/'
   *     collectionName: 'customers'
   *     id: '42'
   *     query: this.createQuery('foo=1')
   *     resourceUrl: 'http://localhost/api/customers/'
   */
  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    const newUrl = url.replace(this.appApiUrl, '');
    const parsed = utils.parseRequestUrl(newUrl);
    const resourceUrl = (newUrl.split('?'))[0];
    parsed.collectionName = resourceUrl;
    parsed.id = undefined;
    parsed.resourceUrl = '/' + newUrl;
    return parsed;
  }

  /**
   * Provide a `responseInterceptor` method of this type in your `inMemDbService` to
   * morph the response options created in the `collectionHandler`.
   */
  responseInterceptor(res: ResponseOptions, ri: RequestInfo): ResponseOptions {
    // res.headers.set('X-TOKEN', 'abcdefg');
    // res.body = {
    //   'response': {
    //     data: res.body
    //   }
    // };
    return res;
  }

  /**
   * Creates an in-memory "database" hash whose keys are collection names
   * and whose values are arrays of collection objects to return or update.
   *
   * returns Observable of the database because could have to create it asynchronously.
   *
   * This method must be safe to call repeatedly.
   * Each time it should return a new object with new arrays containing new item objects.
   * This condition allows the in-memory backend service to mutate the collections
   * and their items without touching the original source data.
   *
   * The in-mem backend service calls this method without a value the first time.
   * The service calls it with the `RequestInfo` when it receives a POST `commands/resetDb` request.
   * Your InMemoryDbService can adjust its behavior accordingly.
   */
  createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
    return this._db;
  }

  // get({ collection, collectionName, headers, id, query, url }: RequestInfo): ResponseOptions {
  get(reqInfo: RequestInfo): Observable<any> {
    const method = this._methods[reqInfo.collectionName];
    if (this._db[reqInfo.collectionName] && method && method['get']) {
      return reqInfo.utils.createResponse$(() => {
        const body = method['get'](reqInfo);
        const options: ResponseOptions = {
          body: body,
          headers: reqInfo.headers,
          status: STATUS.OK
        };
        return options;
      }
      );
    }
    return undefined;
  }

  post(reqInfo: RequestInfo): Observable<any> {
    const method = this._methods[reqInfo.collectionName];
    if (this._db[reqInfo.collectionName] && method && method['post']) {
      return reqInfo.utils.createResponse$(() => {
        const body = method['post'](reqInfo);
        const options: ResponseOptions = {
          body: body,
          headers: reqInfo.headers,
          status: STATUS.OK
        };
        return options;
      }
      );
    }
    return undefined;
  }

  put(reqInfo: RequestInfo): Observable<any> {
    const method = this._methods[reqInfo.collectionName];
    if (this._db[reqInfo.collectionName] && method && method['put']) {
      return reqInfo.utils.createResponse$(() => {
        const body = method['put'](reqInfo);
        const options: ResponseOptions = {
          body: body,
          headers: reqInfo.headers,
          status: STATUS.CREATED
        };
        return options;
      }
      );
    }
    return undefined;
  }

  delete(reqInfo: RequestInfo): Observable<any> {
    const method = this._methods[reqInfo.collectionName];
    if (this._db[reqInfo.collectionName] && method && method['delete']) {
      return reqInfo.utils.createResponse$(() => {
        const body = method['delete'](reqInfo);
        const options: ResponseOptions = {
          body: body,
          headers: reqInfo.headers,
          status: STATUS.NO_CONTENT
        };
        return options;
      }
      );
    }
    return undefined;
  }
}
