import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

import inquirer from "inquirer";

function init() {
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

            } else if (answers.action === 'Add Employee') {

            } else if (answers.action === 'Update Employee Role') {
                
            } else if (answers.action === 'View All Roles') {
                
            } else if (answers.action === 'Add Role') {
                
            } else if (answers.action === 'View All Departments') {
                
            } else if (answers.action === 'Add Department') {
                
            } else {
                // exit the client if user selects exit
                this.exit = true;
            }
            if (!this.exit) {
                // if the user does not want to exit, start the client again
                this.init();
            }

        });
}