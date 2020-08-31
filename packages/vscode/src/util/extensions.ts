import { Tree } from '@angular-devkit/schematics';

export const EXTENSIONS_JSON_FILE = './.vscode/extensions.json';

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

export function getCurrentRecommendations(tree: Tree): string[] {
  const existingExtensionsRecommendations = getCurrentExtensionsJsonRecommendations(tree);
  const existingWorkspaceRecommendations = getCurrentWorkspaceRecommendations(tree);

  return Array.from(
    new Set([...existingExtensionsRecommendations, ...existingWorkspaceRecommendations])
  );
}
