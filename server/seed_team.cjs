const mysql = require('mysql2/promise');

async function seedTeam() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Semester7!',
    database: 'atideto'
  });

  const foundersEmployees = [
    ['EMP-01', 'Sam Absihek', 'sam@atideto.in', '+91 94432 10001', 'Founder', 'Executive Leadership', 'Active', 13],
    ['EMP-02', 'Neevas Nagil A R', 'neevas@atideto.in', '+91 94432 10002', 'Co-Founder', 'Executive Leadership', 'Active', 13],
    ['EMP-03', 'Vishnu', 'vishnu@atideto.in', '+91 94432 10003', 'CEO', 'Executive Leadership', 'Active', 13],
    ['EMP-04', 'Kiran', 'kiran@atideto.in', '+91 94432 10004', 'CPO', 'Product Management', 'Active', 10],
    ['EMP-05', 'Yogesh', 'yogesh@atideto.in', '+91 94432 10005', 'Full Stack Developer', 'Software Engineering', 'Active', 13],
    ['EMP-06', 'Sanjay', 'sanjay@atideto.in', '+91 94432 10006', 'Editor & Designer', 'Design & Media', 'Active', 8],
    ['EMP-07', 'Sachin', 'sachin@atideto.in', '+91 94432 10007', 'Client Manager', 'Client Operations & CRM', 'Active', 12]
  ];

  await conn.query('DELETE FROM staff');
  for (const st of foundersEmployees) {
    await conn.query(
      'INSERT INTO staff (emp_id, name, email, phone, role, department, status, assigned_students) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      st
    );
  }

  const [rows] = await conn.query('SELECT * FROM staff');
  console.log('SUCCESSFULLY_SEEDED_STAFF:', rows.length);
  rows.forEach(r => console.log(` - ${r.emp_id}: ${r.name} (${r.role}) - ${r.department}`));
  await conn.end();
}

seedTeam().catch(console.error);
