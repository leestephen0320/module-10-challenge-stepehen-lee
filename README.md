# Module 10 Challenge Stephen Lee [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

I wanted to create a comand-line application to manage a company's employee database. Not all employees know how to do so using SQL, so I have created the application. It would be easier to use as it prompts the user to either SELECT, INSERT, or UPDATE using everyday language. It also combines the three tables when necessary without the user having to worry about the relationships between the tables.

## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

- First run `npm i` in the command line to install the necssary node modules. Node.js, Inquirer, and PostgreSQL in particular.

Then create database `company_db` using the `schema.sql` and popoulate the tables using the `seeds.sql`

- Then create your own `.env` file with the following parameters.
    - `DB_NAME=company_db`
    - `DB_USER=postgres`
    - `DB_PASSWORD=`

Set the password to your personal password to your Postgres.

## Usage

Run the application in the terminal through `node index.js`.

![alt text](assets/images/screenshot.png)

### View All Employees

Tables all relevant employee data on the terminal.

### Add Employee

Asks for the new employee's first name, last name, role, and manager. The role and manager being list that has their respective column's data.

### Update Employee Role

Asks for employee's full name and then asks for which role to change into.

### Add Role

Asks the name of the role and the name of department role is part of.

### View All Departments

Tables all relevant department data.

### Add Department

Asks for the name of the department to be added.

### Quit

Quits the application

## Credits

GitHub Repository: https://github.com/leestephen0320/module-10-challenge-stepehen-lee/tree/main

Video Link: https://drive.google.com/file/d/1MnPOTa7_vTlncPR6mWngEh7G1TS6heOd/view

## License

Distributed under the MIT License.

## Tests

Try to put the following inputs after running the code.