import { Injectable, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, from, of } from 'rxjs';
import { map, mergeAll, reduce, filter } from 'rxjs/operators';

import { DwCreateService } from './service/create.service';
import { DwReadService } from './service/read.service';
import { DwUpdateService } from './service/update.service';
import { DwDeleteService } from './service/delete.service';
import { DwListService } from './service/list.service';
import { DwMetadataService } from './metadata.service';
import { DwDataTable } from './model/data-table';
import { DELETE, CREATE, DwDataRow } from './model/data-row';
import { DwDocumentEvent } from './interface/document-event.interface';


@Injectable()
export class DwDocument extends FormGroup {
  private _haveRead: boolean = false;
  private eventPool: DwDocumentEvent[] = [];
  private event$: Observable<any>;

  constructor(
    private createService: DwCreateService,
    private readService: DwReadService,
    private updateService: DwUpdateService,
    private deleteService: DwDeleteService,
    private listService: DwListService,
    private metadataService: DwMetadataService,
    @Inject('DocumentID') private documentId?: string,
    @Inject('DocumentResource') public resource?: string) {
    super({});

    this.event$ = from(this.eventPool);
  }

  get tables(): { [key: string]: DwDataTable } {
    return (this.controls as { [key: string]: DwDataTable });
  }

  get haveRead(): boolean {
    return this._haveRead;
  }

  registerEvent(event: DwDocumentEvent): void {
    this.eventPool.push(event);
  }

  jsonToTables(datas: object): void {
    const tableTemp = {};
    for (const [name, table] of Object.entries(datas)) {
      if (!this.get(name)) { this.addControl(name, new DwDataTable([])); }
      if (!tableTemp[name]) { tableTemp[name] = []; }
      for (const row of table) {
        if (row['child']) {
          this.jsonToTables(row['child']);
          delete row.child;
        }
        const dataRow = new DwDataRow(row);
        (this.get(name) as DwDataTable).pushRow(dataRow, false);
        tableTemp[name].push(dataRow);
      }
    }
  }

  parseToDataTable(source: Object): { [key: string]: DwDataTable } {
    for (const [name, table] of Object.entries(source)) {
      const dataTable = new DwDataTable(table);
      this.addControl(name, dataTable);

    }
    return {};
  }

  reading(): Observable<any> {
    return this.event$.pipe(
      filter(event => ('reading' in event)),
      map(event => {
        const obs = event.reading();
        return (obs instanceof Observable) ? obs : of(obs);
      }),
      mergeAll(),
      reduce((acc, val) => {
        return acc && val;
      }, true)
    );
  }

  readed(result: any): void {
    this.event$.subscribe(event => {
      let obs: any = true;
      if ('readed' in event) {
        obs = event.readed(result);
      }
    });
  }

  read(oid: object[] | object, clear: boolean = true): Observable<any> {
    const reading = this.reading().pipe(
      map(result => {
        if (result) {
          return this.readService.read(this.resource, oid);
        } else {
          return of();
        }
      }),
      mergeAll()
    );

    return new Observable((observer): void => {
      reading.subscribe(response => {
        if (response.data) {
          // for (const [name, table] of Object.entries(response.data)) {
          //   this.addControl(name, new DwDataTable(table));
          // }
          if (clear) {
            this.clearTables();
          }

          this.jsonToTables(response.data);
        }
        this._haveRead = true;
        observer.next(this.controls);
        observer.complete();
        this.readed(response);
      });
    });
  }

  saving(): Observable<any> {
    return this.event$.pipe(
      filter(event => ('saving' in event)),
      map(event => {
        const obs = event.saving();
        return (obs instanceof Observable) ? obs : of(obs);
      }),
      mergeAll(),
      reduce((acc, val) => {
        return acc && val;
      }, true)
    );
  }

  saved(result: any = null): void {
    this.event$.subscribe(event => {
      let obs: any = true;
      if ('saved' in event) {
        obs = event.saved(result);
      }
    });
  }

  save(): Observable<any> {
    this.saving().subscribe();
    let ret: Observable<any>;
    if (this.haveRead) {
      ret = this.update();
    } else {
      ret = this.create();
    }

    return new Observable((observer): void => {
      ret.subscribe(result => {
        observer.next(result);
        observer.complete();
        this.saved(result);
      }, error => { observer.error(error); });
    });
  }

  create(): Observable<any> {
    const tables: any = this.getRawValue();
    for (const [key, table] of Object.entries(tables)) {
      for (const row of (table as Array<any>)) {
        row['$state'] = CREATE;
      }
    }

    return this.createService.create(this.resource, tables);
  }

  update(): Observable<any> {
    const tables: any = this.getRawValue();
    const temp = {};
    for (const [key, table] of Object.entries(tables)) {
      const tempTable = [];
      for (const row of (table as Array<any>)) {
        if (row['$state'] !== '') {
          tempTable.push(row);
        }
      }

      temp[key] = tempTable;
    }

    return this.updateService.update(this.resource, temp);
  }

  deleting(): Observable<any> {
    return this.event$.pipe(
      filter(event => ('deleting' in event)),
      map(event => {
        const obs = event.deleting();
        return (obs instanceof Observable) ? obs : of(obs);
      }),
      mergeAll(),
      reduce((acc, val) => {
        return acc && val;
      }, true)
    );
  }

  deleted(): void {
    this.event$.subscribe(event => {
      let obs: any = true;
      if ('deleted' in event) {
        obs = event.deleted();
      }
    });
  }

  delete(oids: any): Observable<any> {
    this.deleting().subscribe();
    const tables: any = this.getRawValue();
    const temp = {};
    for (const [key, table] of Object.entries(tables)) {
      const tempTable = [];
      for (const row of (table as Array<any>)) {
        if (row['$state'] === DELETE) { tempTable.push(row); }
      }

      temp[key] = tempTable;
    }
    console.log(temp, 'delete tables:');

    this.deleted();
    return this.deleteService.delete(this.resource, oids);
  }

  list(queryInfo: object): Observable<any> {
    return this.listService.list((this.resource + '/List'), queryInfo);
  }

  clearTables(): void {
    for (const key in this.controls) {
      if (this.controls.hasOwnProperty(key)) {
        delete this.controls[key];
      }
    }
  }
}
