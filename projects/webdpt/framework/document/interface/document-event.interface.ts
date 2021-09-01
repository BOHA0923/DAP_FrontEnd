import { Observable } from 'rxjs';

export interface IDwDocumentOnRead {
  reading(): Observable<boolean> | boolean;
  readed(result: any): void;
}

export interface IDwDocumentOnSave {
  saving(): Observable<boolean> | boolean;
  saved(result: any): void;
}

export interface IDwDocumentOnDelete {
  deleting(): Observable<boolean> | boolean;
  deleted(result: any): void;
}


export type DwDocumentEvent = IDwDocumentOnRead | IDwDocumentOnSave | IDwDocumentOnDelete;
