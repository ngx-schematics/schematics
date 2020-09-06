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
    console.log('Options', options);
    const extensions = getCurrentRecommendations(tree);
    const copyFiles = apply(url('./files'), [
      template({
        extensions: JSON.stringify(extensions),
        nodeVersion: options['node-version'],
        name: options.name || 'Angular Dev Container',
        extraModules: ''
      }),
      move('./.devcontainer/')
    ]);
    const rule = mergeWith(copyFiles, MergeStrategy.Default);
    return rule(tree, _context);
  };
}
