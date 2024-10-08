import pg from 'pg';
import inquirer from "inquirer";
import dotenv from 'dotenv';

dotenv.config();

// connect to data base

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
  });
  
const connectToDb = async () => {
try {
    await pool.connect();
    console.log('Connected to the database.');
} catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
}
};

await connectToDb();

// =======================================
// Functions to call sql queries


// class that contains the function to access and manipulate database within terminal

class Cli {
    // property that will enable the performActions(); to exit
    exit = false;

    // query functions
    async viewAllEmployees() {
        try {
            const text = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, roles.title AS 
                title, department.department_name AS department, roles.salary AS salary, CONCAT(m.first_name,' ',m.last_name) AS 
                manager_name FROM employee e JOIN roles ON e.role_id = roles.id JOIN department ON roles.department_id = department.id 
                LEFT JOIN employee m on e.manager_id = m.id`;
            const res = await pool.query(text);
            console.table(res.rows);
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
    };

    async viewAllDepartments() {
        try {
            const text = `SELECT * FROM department`;
            const res = await pool.query(text);
            console.table(res.rows);
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
    };

    async addDepartment(department) {
        try {
            const text = `INSERT INTO department (name) VALUES ${department}`;
            const res = await pool.query(text);
            console.table(res.rows);
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

     async getDepartment() {
        try {
            const text = `SELECT * FROM department`;
            const res = await pool.query(text);
            let departments = [];
            for (let i=0; i<res.rows.length; i++) {
                departments.push(res.rows[i].department_name)
            }
            return departments;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

     async viewAllRoles() {
        try {
            text = `SELECT r.id AS if, r.title AS title, d.department_name AS department, r.salary AS salary
                FROM roles r
                JOIN department d ON r.department_id = d.id`
            const res = await pool.query(text);
            console.table(res.rows);
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

     async addRole(title,salary,department) {
        try {
            const text1 = `SELECT id FROM department WHERE department_name = ${department}`;
            const res1 = await pool.query(text1);

            const text2 = `INSERT INTO roles (title,salary,department_id)
                VALUES (${title},${salary},${res1.rows[0]}),`;
            const res2 = await pool.query(text2);
            console.table(res2.rows);
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

    performActions() {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        'View All Employees',
                        'Add Employee',
                        'Update Employee Role',
                        'View All Roles',
                        'Add Role',
                        'View All Departments',
                        'Add Department',
                        'Quit',
                    ],
                },
            ])
            .then((answers) => {
                if (answers.action === 'View All Employees') {
                    this.viewAllEmployees();
                } else if (answers.action === 'Add Employee') {
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'employee',
                                message: 'What'
                            }
                        ])
                } else if (answers.action === 'Update Employee Role') {
                    
                } else if (answers.action === 'View All Roles') {
                    this.viewAllRoles();
                } else if (answers.action === 'Add Role') {
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'role',
                                message: 'What is the name of the role?',
                            },
                            {
                                type: 'input',
                                name: 'salary',
                                message: 'What is the salary of the role?'
                            },
                            {
                                type: 'list',
                                name: 'department',
                                message: 'Which department does it belong to?',
                                list: [this.getDepartment()]
                            }
                        ])
                        .then((answer) => {

                        })
                } else if (answers.action === 'View All Departments') {
                    const res = this.viewAllDepartments();
                    console.table(res.rows);
                } else if (answers.action === 'Add Department') {
                    inquirer
                        .prompt([
                            {
                                type:'input',
                                name: 'department',
                                message: 'Name the new department:',
                            }
                        ])
                        .then((answer) => {
                            this.addDepartment(answer.department);
                            console.log(`Added ${answer.department} to the database.`);
                        })
                } else {
                    // exit the client if user selects exit
                    this.exit = true;
                }
                if (!this.exit) {
                    // if the user does not want to exit, start the client again
                    this.performActions();
                }

            });
    }
}

const cli = new Cli;
//cli.performActions();