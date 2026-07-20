import { DependencyType } from './enums';

export interface TaskDependencyProps {
  id?: string;
  taskId: string;
  dependsOnTaskId: string;
  type?: DependencyType;
  createdAt?: Date;
}

export class TaskDependency {
  private props: Required<TaskDependencyProps>;

  constructor(props: TaskDependencyProps) {
    this.props = {
      id: props.id || '',
      taskId: props.taskId,
      dependsOnTaskId: props.dependsOnTaskId,
      type: props.type ?? DependencyType.BLOCKED_BY,
      createdAt: props.createdAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get taskId(): string { return this.props.taskId; }
  public get dependsOnTaskId(): string { return this.props.dependsOnTaskId; }
  public get type(): DependencyType { return this.props.type; }
  public get createdAt(): Date { return this.props.createdAt; }
}
