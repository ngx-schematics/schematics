import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getCurrentRecommendations, EXTENSIONS_JSON_FILE } from '../util';

export default function extensions(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const recommendedExtensions = [
      'johnpapa.angular-essentials',
      'ms-vscode.vscode-typescript-tslint-plugin'
    ];

    if (options.intellicode) {
      recommendedExtensions.push('visualstudioexptteam.vscodeintellicode');
    }

    if (options.github) {
      recommendedExtensions.push('github.vscode-pull-request-github');
    }

    const existingRecommendations = getCurrentRecommendations(tree);

    const combinedRecommendations = Array.from(
      new Set([...existingRecommendations, ...recommendedExtensions])
    ).sort();
    const recommended = {
      recommended: combinedRecommendations
    };

    if (tree.exists(EXTENSIONS_JSON_FILE)) {
      tree.overwrite(EXTENSIONS_JSON_FILE, JSON.stringify(recommended, null, 2));
    } else {
      tree.create(EXTENSIONS_JSON_FILE, JSON.stringify(recommended, null, 2));
    }

    return tree;
  };
}
