import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { LayerStorageService } from '../services/layer-storage.service';
import { Observable } from 'rxjs';
import { Samplingpoint } from '../classes/sampling-point';

@Injectable({
  providedIn: 'root'
})
export class ServerConnectionService {

  constructor(private layerStorage: LayerStorageService,
              private httpClient: HttpClient) { }

  httpHeaders: HttpHeaders;

  // tslint:disable-next-line: ban-types
  consumeRectification(kFormat: string, kSize: number, rectificationMethod: string, iteration: number): Observable<HttpResponse<Object>> {
    const url = 'https://adb.md.utfpr.edu.br/api/rectification/retify';
    const samplingPoints: Samplingpoint[] = this.layerStorage.getOriginalLayer().samplingPoints;

    this.httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });

    return this.httpClient.post(url, {
      method: rectificationMethod,
      kernelSize: kSize,
      kernelFormat: kFormat,
      iterations: iteration,
      dataset: samplingPoints
    },
    {
      headers: this.httpHeaders,
      responseType: 'json',
      observe: 'response'
    });
  }
}
