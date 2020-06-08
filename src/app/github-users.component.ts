import {Component, OnInit} from '@angular/core';
import {GithubService} from './github-users-search.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GithubDataModel} from './github-data.model';

@Component({
  selector: 'github-users-app',
  templateUrl: './github-users.component.html',
  styleUrls: ['./github-users.component.scss']
})
export class GithubUsersComponent implements OnInit {
  searchField: FormControl;
  githubUsersSearchForm: FormGroup;
  githubData: GithubDataModel[];

  constructor(private githubService: GithubService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.searchField = new FormControl('', [Validators.required]);
    this.githubUsersSearchForm = this.fb.group({search: this.searchField});
    this.githubService.getGitHubData(this.searchField.valueChanges)
      .subscribe(res => this.githubData = res);
  }
}
