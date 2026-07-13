import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const [projects] = await conn.query(
  `SELECT p.id, p.tenantId, p.name, p.status, p.progress, p.actualHours, p.estimatedHours,
          p.startDate, p.endDate, p.ownerId, o.name AS ownerName,
          (SELECT COUNT(*) FROM tasks t WHERE t.projectId = p.id) AS taskCount,
          (SELECT COUNT(*) FROM time_logs tl WHERE tl.projectId = p.id) AS timeLogCount
   FROM projects p LEFT JOIN users o ON o.id = p.ownerId
   WHERE p.name LIKE '%Vehicle%'`,
);

const [jenifer] = await conn.query(
  `SELECT id, name, email, tenantId, role FROM users WHERE name LIKE '%Jenifer%'`,
);

console.log('=== PROJECTS (Vehicle) ===');
console.log(JSON.stringify(projects, null, 2));
console.log('=== JENIFER ===');
console.log(JSON.stringify(jenifer, null, 2));

for (const p of projects) {
  const [mods] = await conn.query(
    `SELECT id, name, status, progress, loggedHours, workDate FROM modules WHERE projectId = ? ORDER BY \`order\``,
    [p.id],
  );
  const [tasks] = await conn.query(
    `SELECT t.id, t.title, t.status, t.actualHours, t.estimatedHours, t.completedAt, a.name AS assignee
     FROM tasks t LEFT JOIN users a ON a.id = t.assigneeId WHERE t.projectId = ?`,
    [p.id],
  );
  const [devs] = await conn.query(
    `SELECT u.id, u.name FROM project_developers pd JOIN users u ON u.id = pd.userId WHERE pd.projectId = ?`,
    [p.id],
  );
  console.log(`\n=== PROJECT ${p.name} (${p.id}) ===`);
  console.log('modules:', JSON.stringify(mods, null, 2));
  console.log('tasks:', JSON.stringify(tasks, null, 2));
  console.log('developers:', JSON.stringify(devs, null, 2));
}

await conn.end();
