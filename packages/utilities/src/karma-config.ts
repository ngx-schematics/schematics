import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { SchematicEngine } from '@angular-devkit/schematics';

import * as ts from 'typescript';
import { TypeScriptFile } from './typescript-file';

export class KarmaConfiguration {
  private _updates = [];

  private _karmaConfig: TypeScriptFile;

  constructor(private _host: Tree, karmaConfigPath: string) {
    try {
      this._karmaConfig = new TypeScriptFile(_host, karmaConfigPath);
    } catch (ex) {
      throw new SchematicsException(
        `${karmaConfigPath} does not reference a Karma configuration file.`
      );
    }
  }

  public get plugins() {
    return [];
  }

  public hasPlugin(pluginName: string): boolean {
    return false;
  }

  public addPlugin(pluginName: string) {}

  public get port(): number {
    // PropertyAssignment:has(Identifier[escapedText='port']) :last-child
    return 9876;
  }
}
