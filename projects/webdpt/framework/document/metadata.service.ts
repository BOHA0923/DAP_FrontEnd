import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DwMetadataService {

  constructor(public http: HttpClient) { }

  getMetadata(programId: string): object {
    return this.http.get('//assets/metadata/' + programId + '.json');
  }

}
