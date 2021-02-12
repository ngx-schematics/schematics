import { Tree } from '@angular-devkit/schematics';

import ignore, { Ignore } from 'ignore';


export class GitIgnore {
  private _gitignoreContent: string | undefined;

  private _ignore: Ignore;

  constructor(private _host: Tree, gitignorePath = '.gitignore') {
    const contentBuffer = _host.read(gitignorePath);
    this._gitignoreContent = contentBuffer?.toString();
    this._ignore = ignore().add(this.content);
  }

  public get content(): string {
    return this._gitignoreContent ?? '';
  }

  /**
   * Returns whether any of the rules in the .gitignore file would pertain to the provided path.
   * This does not indicate whether or not the .gitignore file would ignore or allow the
   * provided path, only that it is covered by a path glob in the file.
   *
   * @param path the path that will be compared to the ignore file rules.
   *
   * @return {boolean} true if the path is covered by an existing rule in the ignore file, false
   * if no rule exists in the file that would test the path.
   */
  public testsPath(path: string): boolean {
    const ignored = this._ignore.test(path);
    return ignored.ignored || ignored.unignored;
  }

  /**
   * Returns whether the rules in the .gitignore file would allow the the file or folder at
   * a specified path, either because it is not ignored by a rule or a negated rule allows it.
   *
   * @param path the path that will be checked against allowed path rules.
   *
   * @return {boolean} true if the path would be allowed by the ignore file rules, false if it
   * would be ignored.
   */
  public allowsPath(path: string): boolean {
    const ignored = this._ignore.test(path);
    return !ignored.ignored || ignored.unignored;
  }

  /**
   * Returns whethre the rules from the .gitignore file would cause the file or folder to be
   * ignored.
   *
   * @param path the path that will be checked against ignored path rules.
   *
   * @return {boolean} true if the path would be ignored by the ignore file rules.
   */
  public ignoresPath(path: string): boolean {
    return this._ignore.ignores(path);
  }
}
