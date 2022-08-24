/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';
import { TypeScriptProject } from 'projen/lib/typescript';
import { StaticImplements, IAuxiliary, IAuxiliaryStatic } from '../../';
@StaticImplements<IAuxiliaryStatic>()
export class DictionaryAuxiliary implements IAuxiliary<TypeScriptProject> {
  private static _instance: DictionaryAuxiliary;
  static get instance(): DictionaryAuxiliary {
    if (!this._instance) this._instance = new DictionaryAuxiliary();
    return this._instance;
  }
  private readonly dictionaryDirPath = path.join(__dirname, 'data');
  private constructor() {}
  async process(project: TypeScriptProject): Promise<void> {
    const { eslint } = project;
    if (!eslint) throw new Error(`Eslint is not defined in the project`);
    eslint.addPlugins('spellcheck');
    project.addDevDeps('eslint-plugin-spellcheck');
    const dictionary = new Set<string>();
    fs.readdirSync(this.dictionaryDirPath).forEach((eachDictionaryFileName) => {
      if (path.parse(eachDictionaryFileName).ext != '.json') return;
      const eachFilePath = path.join(
        this.dictionaryDirPath,
        eachDictionaryFileName,
      );
      const words = [
        ...new Set(
          (require(eachFilePath) as Array<string>)
            .map((eachWord) => eachWord.trim().toLowerCase())
            .sort(),
        ),
      ];
      fs.writeFileSync(eachFilePath, JSON.stringify(words, null, 2));
      words.forEach((eachWord) => dictionary.add(eachWord));
    });
    eslint.addRules({
      'spellcheck/spell-checker': [
        'warn',
        {
          skipWords: [...dictionary],
        },
      ],
    });
  }

  get output(): undefined {
    return;
  }
}
