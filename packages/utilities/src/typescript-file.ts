import * as ts from 'typescript';
import { Tree, SchematicsException } from '@angular-devkit/schematics';

const byKind = (kind: ts.SyntaxKind) => (node: ts.Node) => node?.kind === kind;

export class TypeScriptFile {
  private _updates = [];

  private _sourceFile: ts.SourceFile;

  constructor(private _host: Tree, private _tsFilePath: string) {
    const sourceFileContent = this._host.read(this._tsFilePath);
    if (!sourceFileContent) {
      throw new SchematicsException(
        `${this._tsFilePath} does not reference a source file.`
      );
    }

    this._sourceFile = ts.createSourceFile(
      this._tsFilePath,
      sourceFileContent.toString('utf-8'),
      ts.ScriptTarget.Latest,
      true
    );
  }

  public getNodesOfType(type: ts.SyntaxKind): ts.Node[] {
    return this.getNodes(this._sourceFile, byKind(type));
  }

  private getNodes(
    node: ts.Node,
    query: (node: ts.Node) => boolean
  ): ts.Node[] {
    const nodes = [];

    if (node) {
      if (query(node)) {
        nodes.push(node);
      }

      const matchingChildren = node
        .getChildren()
        .map((childNode: ts.Node) => this.getNodes(childNode, query))
        .reduce(
          (allChildNodes: ts.Node[], childNodes: ts.Node[]) => [
            ...allChildNodes,
            ...childNodes,
          ],
          []
        );
      nodes.push(...matchingChildren);
    }

    return nodes;
  }
}
