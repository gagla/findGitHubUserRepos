import {Component, OnInit} from '@angular/core';
import {GithubService} from './github-users-search.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'github-users-search-form',
  templateUrl: './github-users-search-form.component.html',
  styleUrls: ['./github-users-search-form.component.scss']
})
export class GithubUsersSearchFormComponent implements OnInit {
  searchField: FormControl;
  githubUsersSearchForm: FormGroup;

  constructor(private githubService: GithubService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.searchField = new FormControl('', [Validators.required]);
    this.githubUsersSearchForm = this.fb.group({search: this.searchField});
    this.githubService.setSearchTerm(this.searchField.valueChanges);
  }
}
