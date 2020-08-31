import { Tree, SchematicsException } from "@angular-devkit/schematics";
import { SchematicEngine } from "@angular-devkit/schematics";

import * as ts from 'typescript';
import { TypeScriptFile } from "./typescript-file";


export class KarmaConfiguration {

    private _updates = [];

    private _karmaConfig: TypeScriptFile;

    constructor(private _host: Tree, karmaConfigPath: string) {
        try {
            this._karmaConfig = new TypeScriptFile(_host, karmaConfigPath);
        } catch (ex) {
            throw new SchematicsException(`${karmaConfigPath} does not reference a Karma configuration file.`);
        }
    }

    public get plugins() {
        return [];
    }

    public hasPlugin(pluginName: string): boolean {
        return false;
    }

    public addPlugin(pluginName: string) {

    }

    private getProperties() {
        return this.findNodes(this._karmaConfig, ts.SyntaxKind.PropertyAssignment);
    }

    /**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
    private findNodes(node: ts.Node, kind: ts.SyntaxKind, max = Infinity): ts.Node[] {
        if (!node || max == 0) {
            return [];
        }

        const arr: ts.Node[] = [];
        if (node.kind === kind) {
            arr.push(node);
            max--;
        }
        if (max > 0) {
            for (const child of node.getChildren()) {
                this.findNodes(child, kind, max).forEach(node => {
                    if (max > 0) {
                        arr.push(node);
                    }
                    max--;
                });

                if (max <= 0) {
                    break;
                }
            }
        }

        return arr;
    }
}