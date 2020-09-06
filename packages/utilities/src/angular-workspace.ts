import {
  getWorkspace,
  WorkspaceSchema,
  WorkspaceProject,
  getProject,
} from 'schematics-utilities';

import { Tree } from '@angular-devkit/schematics';

export default class AngularWorkspace {
  workspace: WorkspaceSchema;

  constructor(private _host: Tree) {
    this.workspace = getWorkspace(_host);
  }

  public get projectNames(): string[] {
    return Object.keys(this.workspace.projects);
  }

  public get defaultProjectName(): string {
    return this.workspace.defaultProject ?? '';
  }

  public getDefaultProject(): WorkspaceProject | null {
    const defaultProject = this.workspace.defaultProject;
    return getProject(this.workspace, this.defaultProjectName);
  }

  public getProject(projectName: string): WorkspaceProject {
    return getProject(this.workspace, projectName);
  }
}
