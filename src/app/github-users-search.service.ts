import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {BranchList, GithubDataModel} from './github-data.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {

  private searchTermSub$: ReplaySubject<Observable<string>> = new ReplaySubject<Observable<string>>(1);

  constructor(private _http: HttpClient) {
  }

  getRepos(user: string): Observable<GithubDataModel[]> {
    return this._http.get<GithubDataModel[]>('https://api.github.com/users/' + user + '/repos').pipe(
      map(items => items.filter(item => item.fork === false))
    );
  }

  getBranches(user: string, repoName: string): Observable<BranchList[]> {
    return this._http.get<BranchList[]>('https://api.github.com/repos/' + user + '/' + repoName + '/branches');
  }

  serachUsers(user$: Observable<string>): Observable<GithubDataModel[]> {
    return user$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        if (!searchTerm) {
          return of([]);
        }
        return this.getRepos(searchTerm);
      }));
  }

  setSearchTerm(searchTerm: Observable<string>): void {
    this.searchTermSub$.next(searchTerm);
  }

  getSearchTerm(): Observable<any> {
    return this.searchTermSub$.asObservable();
  }

  getGitHubData(user$: Observable<string>): Observable<GithubDataModel[]> {
    return this.serachUsers(user$).pipe(
      switchMap((result: GithubDataModel[]) => {
          const reposObs$ = result.map(repo => this.getBranches(repo.owner.login, repo.name));
          return forkJoin(reposObs$).pipe(map(branches =>
            branches.map((branchList, index) => {
              return {
                ...result[index],
                branchList: branchList
              }
            })
          ))
        }
      )
    )
  }
}
