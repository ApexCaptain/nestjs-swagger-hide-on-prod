/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';
import { NodeProject } from 'projen/lib/javascript';
import { StaticImplements, IAuxiliary, IAuxiliaryStatic } from '../../';

@StaticImplements<IAuxiliaryStatic>()
export class DependencyAuxiliary implements IAuxiliary<NodeProject> {
  private static _instance: DependencyAuxiliary;

  static get instance(): DependencyAuxiliary {
    if (!this._instance) this._instance = new DependencyAuxiliary();
    return this._instance;
  }
  private readonly depsJsonPath = path.join(__dirname, 'data', 'deps.json');
  private readonly devDepsJsonPath = path.join(
    __dirname,
    'data',
    'devDeps.json',
  );
  private readonly peerDepsJsonPath = path.join(
    __dirname,
    'data',
    'peerDeps.json',
  );
  private constructor() {}
  async process(project: NodeProject): Promise<void> {
    const deps = [
      ...new Set((require(this.depsJsonPath) as Array<string>).sort()),
    ];
    const devDeps = [
      ...new Set((require(this.devDepsJsonPath) as Array<string>).sort()),
    ];
    const peerDeps = [
      ...new Set((require(this.peerDepsJsonPath) as Array<string>).sort()),
    ];
    fs.writeFileSync(this.depsJsonPath, JSON.stringify(deps, null, 2));
    fs.writeFileSync(this.devDepsJsonPath, JSON.stringify(devDeps, null, 2));
    fs.writeFileSync(this.peerDepsJsonPath, JSON.stringify(peerDeps, null, 2));

    project.addDeps(...deps);
    project.addDevDeps(...devDeps);
    project.addPeerDeps(...peerDeps);
    return;
  }

  get output(): undefined {
    return;
  }
}
