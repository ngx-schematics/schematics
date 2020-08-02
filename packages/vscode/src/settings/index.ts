import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  mergeWith,
  move,
  MergeStrategy,
  url
} from '@angular-devkit/schematics';

export default function settings(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const copyFiles = apply(url('./files'), [move('./.vscode/')]);
    const rule = mergeWith(copyFiles, MergeStrategy.Default);
    return rule(tree, _context);
  };
}
