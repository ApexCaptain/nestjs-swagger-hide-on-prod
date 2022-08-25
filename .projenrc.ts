import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { KoconutArray } from 'koconut';
import { javascript, typescript } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { TypeScriptModuleResolution } from 'projen/lib/javascript';
import {
  IAuxiliary,
  DependencyAuxiliary,
  DictionaryAuxiliary,
} from './project';

const project = new typescript.TypeScriptProject({
  eslintOptions: {
    tsconfigPath: './tsconfig.dev.json',
    dirs: ['src'],
    devdirs: ['test', 'project', 'tasks', 'data'],
    prettier: true,
  },
  projenrcTs: true,
  tsconfig: {
    compilerOptions: {
      declaration: true,
      module: 'commonjs',
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowSyntheticDefaultImports: true,
      target: 'es2017',
      baseUrl: './',
      skipLibCheck: true,
      strictNullChecks: true,
      noImplicitAny: false,
      forceConsistentCasingInFileNames: false,
      noFallthroughCasesInSwitch: false,
      noUnusedLocals: false,
      noUnusedParameters: false,
      moduleResolution: TypeScriptModuleResolution.NODE,
      paths: {
        '@src/*': ['src/*'],
      },
    },
  },
  tsconfigDev: {
    include: ['project/**/*.ts'],
    compilerOptions: {},
  },

  release: false,

  defaultReleaseBranch: 'main',
  depsUpgradeOptions: {
    workflowOptions: {
      schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
      projenCredentials: GithubCredentials.fromPersonalAccessToken({
        secret: 'GITHUB_TOKEN',
      }),
      assignees: ['ApexCaptain'],
    },
  },
  prettier: true,
  prettierOptions: {
    settings: {
      endOfLine: javascript.EndOfLine.AUTO,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: javascript.TrailingComma.ALL,
    },
  },
  scripts: {
    // eslint-disable-next-line spellcheck/spell-checker
    'project@build': 'yarn test && rm -rf dist && tsc && tsc-alias',
    'project@deploy':
      'git add -A && yarn version && git push && git push --tags',
  },
  authorName: 'SangHun Lee',
  packageName: 'nestjs-swagger-hide-on-prod',
  npmignoreEnabled: true,
  name: 'Nestjs Swagger Hide On Prod',
  majorVersion: 1,
});
void (async () => {
  // Modify EsLint Rule
  project.eslint?.addRules({
    'no-unused-vars': 'off',
  });

  // Modify package.json
  project.addFields({
    version: (() => {
      try {
        return execSync(`git describe --tags --abbrev=0`)
          .toString()
          .replace(/\r?\n|\r/g, ' ')
          .trim()
          .slice(1);
      } catch (error) {
        return (
          JSON.parse(
            fs
              .readFileSync(path.join(process.cwd(), 'package.json'))
              .toString(),
          ).version || '1.0.0'
        );
      }
    })(),
  });

  // Aux
  // Dependency Aux
  const dependencyAux = DependencyAuxiliary.instance;
  // Dictionary Aux
  const dictionaryAux = DictionaryAuxiliary.instance;

  // Process Aux
  await KoconutArray.of<IAuxiliary>(dependencyAux, dictionaryAux)
    .onEach((eachAux) => eachAux.process(project))
    .process();

  project.synth();
})();
