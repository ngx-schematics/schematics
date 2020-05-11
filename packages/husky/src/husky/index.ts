import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from 'schematics-utilities';

const SCRIPTS = {
  npm: {
    install: 'npm install',
    run: 'npm run'
  },
  yarn: {
    install: 'yarn',
    run: 'yarn run'
  }
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function husky(_options: HuskyOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addPackageJsonDependency(tree, { type: NodeDependencyType.Dev, name: 'husky', version: '^4.2.5'});

    const packageJson = JSON.parse(tree.read('package.json')?.toString() || '{}');
    const packageScripts = packageJson.scripts;

    const huskyConfig: any = {};    
    packageJson.husky = huskyConfig;
    
    const scripts = SCRIPTS[_options['package-manager'] || 'npm'];
    if (_options["postmerge-install"]) {
      huskyConfig['postmerge'] = scripts.install;
    }

    const prepushLint = _options["prepush-lint"];
    if (prepushLint) {
      const lintScript = 'lint';
      huskyConfig['prepush'] = `${scripts.run} prepush`;
      if (packageScripts['prepush']) {
        packageScripts['prepush'] += `&& ${scripts.run} ${lintScript}`;
      } else {
        packageScripts['prepush'] = `${scripts.run} ${lintScript}`;
      }      
      
      if (!packageScripts[lintScript]) {
        packageScripts[lintScript] = `echo ADD LINTING COMMANDS FOR ${lintScript}`;
      }
    }
    
    const precommitLint = _options["precommit-lint"];
    if (precommitLint) {
      const lintScript = 'lint';
      huskyConfig['precommit'] = `${scripts.run} precommit`;
      if (packageScripts['precommit']) {
        packageScripts['precommit'] += `&& ${scripts.run} ${lintScript}`;
      } else {
        packageScripts['precommit'] = `${scripts.run} ${lintScript}`;
      }      
      
      if (!packageScripts[lintScript]) {
        packageScripts[lintScript] = `echo ADD LINTING COMMANDS FOR ${lintScript}`;
      }
    }

    const precommitFormat = _options["precommit-format"];
    if (precommitFormat) {
      const formatScript = 'format';
      huskyConfig['precommit'] = `${scripts.run} precommit`;
      if (packageScripts['precommit']) {
        packageScripts['precommit'] += `&& ${scripts.run} ${formatScript}`;
      } else {
        packageScripts['precommit'] = `${scripts.run} ${formatScript}`;
      }      
      
      if (!packageScripts[formatScript]) {
        packageScripts[formatScript] = `echo ADD FORMATTING COMMANDS FOR ${formatScript}`;
      }
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    return tree;
  };
}
