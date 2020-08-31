import { getWorkspace, WorkspaceSchema, WorkspaceProject, getProject } from 'schematics-utilities';

import { Tree } from '@angular-devkit/schematics';

export default class AngularWorkspace {

    workspace: WorkspaceSchema;

    constructor(private _host: Tree) {
        this.workspace = getWorkspace(_host);
    }

    public get projects(): string[] {
        return Object.keys(this.workspace.projects);
    }

    public getDefaultProject(): WorkspaceProject | null {
        const defaultProject = this.workspace.defaultProject;
        return getProject(this.workspace, this.workspace.defaultProject ?? '');
    }

    public getProject(projectName: string): WorkspaceProject {
        return getProject(this.workspace, projectName);
    }



}