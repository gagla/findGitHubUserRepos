import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GithubUsersComponent } from './github-users.component';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GithubUsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [GithubUsersComponent]
})
export class AppModule { }
