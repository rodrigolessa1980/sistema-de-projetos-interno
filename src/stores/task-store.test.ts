import { describe, expect, it } from "vitest";
import { toCreateTaskPayload } from "./task-store";
import type { Task } from "@/types";

describe("toCreateTaskPayload", () => {
  it("removes frontend-only fields rejected by the create task API", () => {
    const data: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      projectId: "project-1",
      moduleId: "module-1",
      epicId: "epic-1",
      parentTaskId: undefined,
      title: "Implementar fluxo",
      description: "Criar tarefa sem enviar campos extras",
      status: "BACKLOG",
      complexity: 3,
      assigneeId: "user-1",
      reporterId: "user-2",
      estimatedHours: 8,
      actualHours: 0,
      startDate: undefined,
      dueDate: "",
      completedAt: undefined,
      dependencyIds: [],
      tags: [],
      order: 0,
      blockedReason: undefined,
      isUrgent: false,
      urgentBlockedById: undefined,
      urgentPreviousStatus: undefined,
    };

    const payload = toCreateTaskPayload(data);

    expect(payload).toMatchObject({
      projectId: "project-1",
      moduleId: "module-1",
      epicId: "epic-1",
      title: "Implementar fluxo",
      status: "BACKLOG",
    });
    expect(payload).not.toHaveProperty("dependencyIds");
    expect(payload).not.toHaveProperty("tags");
    expect(payload).not.toHaveProperty("completedAt");
    expect(payload).not.toHaveProperty("urgentBlockedById");
    expect(payload).not.toHaveProperty("urgentPreviousStatus");
  });
});
