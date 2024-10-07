import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

async function viewAllDepartments() {
    try {
        const res = await pool.query('SELECT * FROM department');
        console.log(res.rows);
    } catch (err) {
        console.error('Error executing query',err.stack)
    }
 }

 async function addDepartment(department: string) {
    try {
        const res = await pool.query(`INSERT INTO department (name) VALUES ${department}`);
        console.log(res.rows);
    } catch (err) {
        console.error('Error executing query',err.stack)
    }
 }

 export default query_functions;