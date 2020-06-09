import {Component, OnDestroy, OnInit} from '@angular/core';
import {GithubService} from './github-users-search.service';
import {BranchList, GithubDataModel} from './github-data.model';
import {Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'github-users-app',
  templateUrl: './github-users.component.html',
  styleUrls: ['./github-users.component.scss']
})
export class GithubUsersComponent implements OnInit, OnDestroy {

  githubData: GithubDataModel[];
  subscription: Subscription;

  constructor(private githubService: GithubService) {
  }

  ngOnInit() {
    this.subscription = this.githubService.getSearchTerm().pipe(
      switchMap(searchTerm =>
        this.githubService.getGitHubData(searchTerm)
      )
    ).subscribe(data => this.githubData = data)
  }

  trackByFnRepos(index: number, item: GithubDataModel) {
    return index;
  }

  trackByFnBranches(index: number, item: BranchList) {
    return index;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
