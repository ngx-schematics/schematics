import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

// SchematicTestRunner needs an absolute path to the collection to test.
const collectionPath = path.join(__dirname, '../collection.json');

describe('extensions', () => {
  const EXTENSIONS_FILE_PATH = '/.vscode/extensions.json';

  const expectExtensions = (tree: UnitTestTree, extensionList: string[]) => {
    const extensionsFileContent = tree.readContent(EXTENSIONS_FILE_PATH);
    const extensionsJson = JSON.parse(extensionsFileContent);

    expect(extensionsJson.recommended).toEqual(extensionList);
  };

  it('creates the extensions.json file', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('extensions', {}, Tree.empty()).toPromise();

    expect(tree.files.sort()).toEqual([EXTENSIONS_FILE_PATH]);
  });

  it('adds the default extensions', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('extensions', {}, Tree.empty()).toPromise();

    expectExtensions(tree, ['johnpapa.angular-essentials']);
  });

  it('adds the github extensions when the option is specified', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync('extensions', { github: true }, Tree.empty())
      .toPromise();

    expectExtensions(tree, ['github.vscode-pull-request-github', 'johnpapa.angular-essentials']);
  });

  it('removes the intellicode extensions when the option is specified', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync('extensions', { intellicode: true }, Tree.empty())
      .toPromise();

    expectExtensions(tree, [
      'johnpapa.angular-essentials',
      'visualstudioexptteam.vscodeintellicode'
    ]);
  });

  it('merges existing extensions with recommended ones', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const initialTree = Tree.empty();
    initialTree.create(
      EXTENSIONS_FILE_PATH,
      JSON.stringify({ recommendations: ['existing.extension1'] })
    );
    initialTree.create(
      './sample.code-workspace',
      JSON.stringify({
        extensions: {
          recommendations: [
            'workspace1.extension1',
            'visualstudioexptteam.vscodeintellicode',
            'workspace1.extension2'
          ]
        }
      })
    );
    initialTree.create(
      './.code-workspace',
      JSON.stringify({
        extensions: {
          recommendations: ['workspace2.extension1']
        }
      })
    );

    const tree = await runner
      .runSchematicAsync('extensions', { intellicode: true }, initialTree)
      .toPromise();

    expectExtensions(tree, [
      'existing.extension1',
      'johnpapa.angular-essentials',
      'visualstudioexptteam.vscodeintellicode',
      'workspace1.extension1',
      'workspace1.extension2',
      'workspace2.extension1'
    ]);
  });
});
