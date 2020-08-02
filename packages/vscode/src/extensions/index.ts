import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

const EXTENSIONS_JSON_FILE = './.vscode/extensions.json';

function getCurrentWorkspaceRecommendations(tree: Tree): string[] {
  const workspaces = tree
    .getDir('.')
    .subfiles.filter(path => path?.toLowerCase().endsWith('.code-workspace'));
  return workspaces
    .map<string[]>(workspacePath => {
      const workspaceContent = tree.read(workspacePath)?.toString('UTF-8') as string;
      const workspaceJson = JSON.parse(workspaceContent);
      return workspaceJson?.extensions?.recommendations || [];
    })
    .reduce(
      (allRecomendations, workspaceRecommendations) => [
        ...allRecomendations,
        ...workspaceRecommendations
      ],
      []
    );

  return [];
}

function getCurrentExtensionsJsonRecommendations(tree: Tree): string[] {
  if (tree.exists(EXTENSIONS_JSON_FILE)) {
    const extensionsContent = tree.read(EXTENSIONS_JSON_FILE)?.toString('UTF-8') as string;
    const extensionsJson = JSON.parse(extensionsContent);

    return extensionsJson?.recommendations ?? [];
  }

  return [];
}

function getCurrentRecommendations(tree: Tree): string[] {
  const existingExtensionsRecommendations = getCurrentExtensionsJsonRecommendations(tree);
  const existingWorkspaceRecommendations = getCurrentWorkspaceRecommendations(tree);

  return Array.from(
    new Set([...existingExtensionsRecommendations, ...existingWorkspaceRecommendations])
  );
}

export default function extensions(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const recommendedExtensions = ['johnpapa.angular-essentials'];

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
