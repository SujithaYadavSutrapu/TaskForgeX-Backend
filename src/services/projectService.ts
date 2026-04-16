import { pool } from "../config/db";
import { AppError } from "../utils/appError";

export const createProjectService = async (
  name: string,
  description: string,
  userId: number
) => {
  if (!name || !name.trim()) {
    throw new AppError("Project name is required", 400);
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const projectResult = await client.query(
      `INSERT INTO projects (name, description, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), description || null, userId]
    );

    const project = projectResult.rows[0];

    await client.query(
      `INSERT INTO project_members (user_id, project_id, role)
       VALUES ($1, $2, 'admin')`,
      [userId, project.id]
    );
    await client.query("COMMIT");
    return project;
  } catch (err: any) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      throw new AppError("Project with this name already exists", 409);
    }

    throw err;
  } finally {
    client.release();
  }
};