import { Project } from '../../../core/domain/entities/project.entity';
import { ProjectStatus } from '../../../core/domain/entities/enums';

export interface ProjectResponse {
  id: string;
  companyId: string | null;
  name: string;
  description: string;
  technicalDescription: string | null;
  demandDescription: string | null;
  requestedBy: string | null;
  status: ProjectStatus;
  ownerId: string;
  developerIds: string[];
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
  static toHTTP(project: Project & { developerIds?: string[] }): ProjectResponse {
    return {
      id: project.id,
      companyId: project.companyId,
      name: project.name,
      description: project.description,
      technicalDescription: project.technicalDescription,
      demandDescription: project.demandDescription,
      requestedBy: project.requestedBy,
      status: project.status,
      ownerId: project.ownerId,
      developerIds: (project as any).developerIds ?? [],
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
