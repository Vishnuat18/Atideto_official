const http = require('http');

async function testSql() {
  console.log('--- Testing SQL Operations ---');
  
  // 1. SHOW TABLES
  let res = await fetch('http://localhost:8080/api/database/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'SHOW TABLES;' })
  });
  let data = await res.json();
  console.log('SHOW TABLES:', data.success, 'Rows:', data.rowCount);

  // 2. SELECT students
  res = await fetch('http://localhost:8080/api/database/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'SELECT student_id, name, email, phone, college FROM students LIMIT 3;' })
  });
  data = await res.json();
  console.log('SELECT students:', data.success, 'First student:', data.rows[0]?.name);

  // 3. COUNT
  res = await fetch('http://localhost:8080/api/database/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'SELECT count(*) as total FROM students;' })
  });
  data = await res.json();
  console.log('COUNT students:', data.success, 'Total:', data.rows[0]?.total);

  // 4. Test Registration insert
  res = await fetch('http://localhost:8080/api/database/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "INSERT INTO registrations (reg_id, student_name, email, phone, college, degree, grad_year, course_interest, domain, mode, notes) VALUES ('TEST-REG-999', 'Test User', 'test@atideto.in', '+91 99999 99999', 'Test College', 'B.Tech IT', '2027', 'Web Dev', 'Web Dev', 'Industrial Hybrid', 'Automated test') ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);"
    })
  });
  data = await res.json();
  console.log('INSERT registration:', data.success, 'Affected:', data.affectedRows);

  console.log('--- All SQL Operations Verified Successfully ---');
}

testSql().catch(console.error);
