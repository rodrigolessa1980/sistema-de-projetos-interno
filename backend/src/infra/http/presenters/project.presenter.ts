import { Project } from '../../../core/domain/entities/project.entity';
import { ProjectStatus } from '../../../core/domain/entities/enums';

export interface ProjectResponse {
  id: string;
  companyId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  startDate: string;
  endDate: string | null;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  color: string;
  avatar: string | null;
  testUrl: string | null;
  queueOrder: number | null;
  createdAt: string;
  updatedAt: string;
}

export class ProjectPresenter {
  static toHTTP(project: Project): ProjectResponse {
    return {
      id: project.id,
      companyId: project.companyId,
      name: project.name,
      description: project.description,
      status: project.status,
      ownerId: project.ownerId,
      startDate: project.startDate.toISOString(),
      endDate: project.endDate ? project.endDate.toISOString() : null,
      estimatedHours: project.estimatedHours,
      actualHours: project.actualHours,
      progress: project.progress,
      color: project.color,
      avatar: project.avatar,
      testUrl: project.testUrl,
      queueOrder: project.queueOrder,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
