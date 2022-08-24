import { Project } from 'projen';
export interface IAuxiliary<
  ProjectType extends Project = Project,
  OutputType = any,
> {
  process(project: ProjectType): Promise<void>;
  get output(): OutputType;
}
export interface IAuxiliaryStatic {
  get instance(): IAuxiliary;
}
