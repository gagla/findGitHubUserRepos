import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/operators';
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
