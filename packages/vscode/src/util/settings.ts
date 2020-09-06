import { Tree } from '@angular-devkit/schematics';

export const SETTINGS_JSON_FILE = './.vscode/settings.json';

export function getVscodeSettings(tree: Tree): string[] {
  const settingsContent = tree.read(SETTINGS_JSON_FILE)?.toString('UTF-8') as string;
  const settingsJson = JSON.parse(settingsContent);
  return settingsJson || {};
}
