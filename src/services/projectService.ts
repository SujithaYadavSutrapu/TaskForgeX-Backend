import prisma from "../lib/prisma";
import { AppError } from "../utils/appError";

export const createProjectService = async (
  name: string,
  description: string,
  userId: number
) => {
  if (!name || !name.trim()) {
    throw new AppError("Project name is required", 400);
  }

  try {
    const project = await prisma.$transaction(async (tx) => {
      // Create project
      const createdProject = await tx.projects.create({
        data: {
          name: name.trim(),
          description: description || null,
          owner_id: userId,
        },
      });

      // Add owner as admin member
      await tx.project_members.create({
        data: {
          user_id: userId,
          project_id: createdProject.id,
          role: "admin",
        },
      });

      return createdProject;
    } );

    return project;
  } catch (err: any) {
    // PostgreSQL unique violation via Prisma
    if (err.code === "P2002"&& err.meta?.target?.includes("name")) {
      throw new AppError(
        "Project with this name already exists",
        409 
      );
    }

    throw err;
  }
};