import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';

class HeroesMockData implements IDwMockData {
  get data(): any {
    return <Hero[]>[
      { id: 1, name: 'Windstorm' },
      { id: 2, name: 'Bombasto' },
      { id: 3, name: 'Magneta' },
      { id: 4, name: 'Tornado' }
    ];
  }

  // GET
  getMethod(reqInfo: RequestInfo): any {
    return reqInfo.collection;
  }

  // POST
  postMethod(reqInfo: RequestInfo | any): any {
    const params: GetHeroesParam = reqInfo.req.body.params;
    if (params && params.name) {
      return reqInfo.collection.filter(hero => hero.name.includes(params.name));
    }
    return reqInfo.collection;
  }

  // DELETE
  deleteMethod(reqInfo: RequestInfo): any {
    return [];
  }

  // PUT
  putMethod(reqInfo: RequestInfo): any {
    return [];
  }
}

// Hero應該定義在外部ts中
interface Hero {
  id: number;
  name: string;
}

// GetHeroesParam應該定義在外部ts中
interface GetHeroesParam {
  name: string;
}

export let heroes = new HeroesMockData();
