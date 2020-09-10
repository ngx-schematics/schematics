import { Tree } from '@angular-devkit/schematics';

export class GitIgnore {
  private _gitignoreContent: string | undefined;

  constructor(private _host: Tree, gitignorePath = '.gitignore') {
    const contentBuffer = _host.read(gitignorePath);
    this._gitignoreContent = contentBuffer?.toString();
  }

  public get content(): string {
    return this._gitignoreContent ?? '';
  }
}
