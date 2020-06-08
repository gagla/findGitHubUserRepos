import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, debounceTime, map, switchMap} from 'rxjs/operators';
import {BranchList, GithubDataModel} from './github-data.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {

  constructor(private _http: HttpClient) {
  }

  getRepos(user): Observable<GithubDataModel[]> {
    return this._http.get<GithubDataModel[]>('https://api.github.com/users/' + user + '/repos').pipe(
      map(items => items.filter(item => item.fork === false))
    );
  }

  getBranches(user, repoName): Observable<BranchList[]> {
    return this._http.get<BranchList[]>('https://api.github.com/repos/' + user + '/' + repoName + '/branches');
  }

  serachUsers(user$: Observable<string>): Observable<GithubDataModel[]> {
    return user$.pipe(
      debounceTime(500),
      switchMap(searchTerm => {
        if (!searchTerm) {
          return of([]);
        }
        return this.getRepos(searchTerm);
      }));
  }
}
