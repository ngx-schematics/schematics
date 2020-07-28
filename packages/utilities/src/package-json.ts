import { NodeDependencyType, findPropertyInAstObject, getPackageJsonDependency, removePackageJsonDependency, addPackageJsonDependency, appendPropertyInAstObject, insertPropertyInAstObjectInOrder, removePropertyInAstObject } from 'schematics-utilities';
import { parseJsonAst } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';
import { JsonAstObject } from '@angular-devkit/core';
import { JsonParseMode } from '@angular-devkit/core';

import * as semver from 'semver';

const PACKAGE_JSON_PATH = '/package.json';

export class PackageJson {

  constructor(private _tree: Tree, private _packageAst: JsonAstObject) {}

  public hasDependency(packageName: string, type?: NodeDependencyType): boolean {
    const dependency = getPackageJsonDependency(this._tree, packageName);
    return dependency && (type) ? dependency.type === type : true;
  }

  public getDependencyType(packageName: string): NodeDependencyType | undefined {
    return getPackageJsonDependency(this._tree, packageName)?.type;
  }

  public hasCompatibleDependency(packageName: string, version: string): boolean {
    const packageVersion = getPackageJsonDependency(this._tree, packageName)?.version;
    return !!packageVersion && semver.satisfies(packageVersion, version);
  }

  public changeDependencyType(packageName: string, type: NodeDependencyType): void {
    const originalDependency = getPackageJsonDependency(this._tree, packageName);
    if (originalDependency && originalDependency.type !== type) {
      this.removeDependency(packageName);
      this.addDependency(packageName, originalDependency.version, type);
    }
  }

  public removeDependency(packageName: string): void {
    removePackageJsonDependency(this._tree, packageName);
  }

  public addDependency(packageName: string, version: string, type?: NodeDependencyType): void {
    type = type || NodeDependencyType.Default;
    addPackageJsonDependency(this._tree, {
      name: packageName,
      version,
      type
    });
  }

  public setScript(scriptName: string, scriptBody: string): void {
    const recorder = this._tree.beginUpdate(PACKAGE_JSON_PATH);
    const scripts = this._getScripts();

    if (!scripts) {
      appendPropertyInAstObject(recorder, this._packageAst, 'scripts', {
        [scriptName]: scriptBody
      }, 2);
    } else {
      removePropertyInAstObject(recorder, scripts, scriptName);
      insertPropertyInAstObjectInOrder(recorder, scripts, scriptName, scriptBody, 2);
    }
    this._tree.commitUpdate(recorder);
  }

  private _getScripts(): JsonAstObject | undefined {
    return findPropertyInAstObject(this._packageAst, 'scripts') as JsonAstObject;
  }
}

export function readPackageJson(tree: Tree): PackageJson {
  const buffer = tree.read(PACKAGE_JSON_PATH);
  if (buffer === null) {
    throw new SchematicsException('Could not read package.json.');
  }
  const content = buffer.toString();

  const packageJson = parseJsonAst(content, JsonParseMode.Strict);
  if (packageJson.kind != 'object') {
    throw new SchematicsException('Invalid package.json. Was expecting an object');
  }

  return new PackageJson(tree, packageJson);
}

