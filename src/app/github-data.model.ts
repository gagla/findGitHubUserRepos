export interface GithubDataModel {
  name: string;
  owner: Owner;
  fork?: boolean;
  branchList?: BranchList[];
}

export interface BranchList {
  name: string;
  commit: { sha: string };
}

export interface Owner {
  login?: string;
}
