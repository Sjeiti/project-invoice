import {Injectable} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

@Injectable()

export class RestService {

  private cacheObject:any = {}

  constructor(
      private http:Http) {
  }

  private getRequest(endpoint:string, map = r=>r, cache = true):Promise<any[]> {
    let cacheKey = JSON.stringify(endpoint),
        isCached = this.cacheObject.hasOwnProperty(cacheKey)
    return cache&&isCached&&Promise.resolve(this.cacheObject[cacheKey])
        ||this.http.get(/*this.config.apiEndpoint+*/endpoint).map(this.map.bind(this, map, cache, cacheKey)).toPromise()
  }

  private map(mapping:any, cache:boolean, cacheKey:string, result:any):any {
    let mappedResult = mapping(result)
    cache&&(this.cacheObject[cacheKey] = mappedResult)
    return mappedResult
  }

  public load(uri:string):Promise<any> {
    return this.getRequest(uri, response=><any[]>response.json())
  }


}