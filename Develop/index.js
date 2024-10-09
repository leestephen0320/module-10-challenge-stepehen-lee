import pg from 'pg';
import inquirer from "inquirer";
import dotenv from 'dotenv';

import EventEmitter from 'events';
const emitter = new EventEmitter(); // Create an instance of EventEmitter

// Now you can set the maximum listeners
emitter.setMaxListeners(15); // Example: setting max listeners to 10

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

        // SELECT quereies
    async viewAllEmployees() {
        try {
            const text = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, roles.title AS 
                title, department.department_name AS department, roles.salary AS salary, CONCAT(m.first_name,' ',m.last_name) AS 
                manager_name FROM employee e JOIN roles ON e.role_id = roles.id JOIN department ON roles.department_id = department.id 
                LEFT JOIN employee m on e.manager_id = m.id`;
            const res = await pool.query(text);
            console.table(res.rows);
            return;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
    };

    async viewAllDepartments() {
        try {
            const text = `SELECT * FROM department`;
            const res = await pool.query(text);
            console.table(res.rows);
            return;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
    };

    async viewAllRoles() {
        try {
            const text = `SELECT r.id AS if, r.title AS title, d.department_name AS department, r.salary AS salary
                FROM roles r
                JOIN department d ON r.department_id = d.id`
            const res = await pool.query(text);
            console.table(res.rows);
            return;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

        // INSERT INTO queries
    async addEmployee(firstName,lastName,role,manager) {
        try {
            const text1 = `SELECT id FROM roles WHERE title = '${role}'`;
            const res1 = await pool.query(text1);
            const resIDr = res1.rows[0].id;

            const text2 =  `SELECT id
                FROM employee e
                WHERE CONCAT(e.first_name,' ',e.last_name) = '${manager}'`;
            const res2 = await pool.query(text2);
            const resIDe = res2.rows[0].id;

            const text3 = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
                VALUES ('${firstName}','${lastName}',${resIDr},${resIDe})`;
            await pool.query(text3);
            //this.performActions();
            return;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

     async addDepartment(department) {
        try {
            const text = `INSERT INTO department (department_name) VALUES ('${department}')`;
            await pool.query(text);
            //this.performActions();            
            return;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

     async addRole(title,salary,department) {
        try {
            const text1 = `SELECT id FROM department WHERE department_name = '${department}'`;
            const res1 = await pool.query(text1);
            const resID = res1.rows[0].id;
            const text2 = `INSERT INTO roles (title,salary,department_id)
                VALUES ('${title}',${salary},${resID})`;
            await pool.query(text2);
            //this.performActions();
            return;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }
        // UPDATE query
     async updateEmployee(employeeName,role) {
        try {
            const text1 = `SELECT id FROM roles WHERE title = '${role}'`;
            const res1 = await pool.query(text1);
            const roleID = res1.rows[0].id;
            const text3 = `UPDATE employee e SET role_id = ${roleID} 
                WHERE CONCAT(e.first_name,' ',e.last_name) = '${employeeName}'`;
            await pool.query(text3);
            // this.performActions();
            return;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

        // misc SELECT queries needed for functionality
     async getEmployees() {
        try {
            const text = `SELECT CONCAT(e.first_name,' ',e.last_name) AS employee_name FROM employee e`;
            const res = await pool.query(text);
            let employeess = [];
            for (let i=0; i<res.rows.length; i++) {
                employeess.push(res.rows[i].employee_name);
            }
            return employeess;
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
                departments.push(res.rows[i].department_name);
            }
            return departments;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

     async getRoles() {
        try {
            const text = `SELECT * FROM roles`;
            const res = await pool.query(text);
            let roles = [];
            for (let i=0; i<res.rows.length; i++) {
                roles.push(res.rows[i].title);
            }
            return roles;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

     async getManagers() {
        try {
            const text = `SELECT CONCAT(e.first_name,' ',e.last_name) AS manager_name
                FROM employee e
                WHERE manager_id IS NULL`;
            const res = await pool.query(text);
            let managers = [];
            for (let i=0; i<res.rows.length; i++) {
                managers.push(res.rows[i].manager_name);
            }
            return managers;
        } catch (err) {
            console.error('Error executing query',err.stack)
        }
     }

        // start of COMMAND LINE INQUIRES
    async performActions() {
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
                    this.performActions()
                } else if (answers.action === 'Add Employee') {
                    return this.getRoles().then(roleChoices => {
                        return this.getManagers().then(managerChoices => {
                            return inquirer.prompt([
                                {
                                    type:'input',
                                    name:'first_name',
                                    message: `What is the employee's first name?`
                                },
                                {
                                    type:'input',
                                    name:'last_name',
                                    message: `What is the employee's last name?`
                                },
                                {
                                    type:'list',
                                    name:'role',
                                    message: `What is the employee's role?`,
                                    choices: roleChoices
                                },
                                {
                                    type:'list',
                                    name:'manager',
                                    message: `Who is the employee's manager?`,
                                    choices: managerChoices
                                }
                            ]).then(employeeAnswers => {
                                console.log(`Added ${employeeAnswers.first_name} ${employeeAnswers.last_name} to the database`)
                                this.addEmployee(employeeAnswers.first_name,employeeAnswers.last_name,employeeAnswers.role,employeeAnswers.manager);
                                return this.performActions();
                            });
                        })
                    });
                } else if (answers.action === 'Update Employee Role') {
                    return this.getEmployees().then(employeeChoices =>{
                        return this.getRoles().then(roleChoices =>{
                            return inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'employeeName',
                                    message: `Which employee's role do you want to update?`,
                                    choices: employeeChoices,
                                },
                                {
                                    type: 'list',
                                    name: 'role',
                                    message: 'Which role do you want to assign the selected employee?',
                                    choices: roleChoices,
                                },
                            ]).then(updateAnswers => {
                                console.log(`Updated ${updateAnswers.employeeName}'s role`);
                                this.updateEmployee(updateAnswers.employeeName,updateAnswers.role);
                                return this.performActions();
                            })
                        })
                    })
                } else if (answers.action === 'View All Roles') {
                    this.viewAllRoles();
                    this.performActions()
                } else if (answers.action === 'Add Role') {
                    return this.getDepartment().then(departmentsChoices => {
                        return inquirer.prompt([
                            {
                                type: 'input',
                                name: 'title',
                                message: 'What is the name of the role?',
                            },
                            {
                                type: 'input',
                                name: 'salary',
                                message: 'What is the salary of the role?',
                            },
                            {
                                type: 'list',
                                name: 'department_id',
                                message: 'Which department does it belong to?',
                                choices: departmentsChoices,
                            },
                        ]);
                    }).then(roleAnswers => {
                        console.log(`Added ${roleAnswers.title} to the database`);
                        this.addRole(roleAnswers.title, roleAnswers.salary, roleAnswers.department_id);
                        return this.performActions();
                    });
                } else if (answers.action === 'View All Departments') {
                    const res = this.viewAllDepartments();
                    console.table(res.rows);
                    this.performActions()
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
                            return this.performActions();
                        })
                } else {
                    // exit the client if user selects exit
                    this.exit = true;
                }
                if (!this.exit) {
                    // if the user does not want to exit, start the client again
                    //this.performActions();
                }

            });
    }
}

const cli = new Cli;

console.log(`
=== ===  ==   ==  === ==   ====      == ==   ==  ==   === ===  === ===  
 ==  ==   == ==    ==  ==   ==      ==   ==  ==  ==    ==  ==   ==  ==  
 ==      = === =   ==  ==   ==      ==   ==  ==  ==    ==       ==      
 == ==   == = ==   ==  ==   ==      ==   ==   == ==    == ==    == ==   
 ==      ==   ==   == ==    ==      ==   ==    ==      ==       ==      
 ==  ==  ==   ==   ==       ==  ==  ==   ==    ==      ==  ==   ==  ==  
=== ===  ==   ==  ====     === ===   == ==     ==     === ===  === ===  
                                                                        
==   ==    ==     ===  ==    ==      == ==   === ===  === ==   
 == ==      ==      == ==     ==    ==   ==   ==  ==   ==  ==  
= === =   == ==    = == =   == ==   ==        ==       ==  ==  
== = ==   ==  ==   == ==    ==  ==  ==  ===   == ==    == ==   
==   ==   == ===   ==  ==   == ===  ==   ==   ==       == ==   
==   ==   ==  ==   ==  ==   ==  ==  ==   ==   ==  ==   ==  ==  
==   ==  ===  ==  ===  ==  ===  ==   == ==   === ===  ==== == 
`)

cli.performActions();