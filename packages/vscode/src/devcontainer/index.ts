import {
  MergeStrategy,
  Rule,
  SchematicContext,
  Tree,
  apply,
  mergeWith,
  move,
  template,
  url
} from '@angular-devkit/schematics';
import { getCurrentRecommendations } from '../util';

export default function devcontainer(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const extensions = getCurrentRecommendations(tree);
    const copyFiles = apply(url('./files'), [
      template({
        extensions,
        nodeVersion: options.nodeVersion,
        name: options.name
      }),
      move('./.devcontainer/')
    ]);
    const rule = mergeWith(copyFiles, MergeStrategy.Default);
    return rule(tree, _context);
  };
}
