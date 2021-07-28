const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');
const chalk = require('chalk');
const cTable = require('console.table'); 

const init = () => { 
    console.log(chalk.green(figlet.textSync('Employee Manger', {
        // font: 'Cursive',
        horizontalLayout: 'full',
        verticalLayout: 'full',
        width: 70,
        whitespaceBreak: true
    })));
    console.log('\n');
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker'
});

let exitTracker = chalk.redBright("Exit")

// init();
const runEmployeeTracker = async () => {
    inquirer
    .prompt([
        {
            type: "list",
            message: "What do you want to do?",
            name: "options",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Departments",
                "View Roles",
                "View All Employees",
                "Update Employee Role",
                exitTracker
            ]
        },
        {
            type: "input",
            message: "What is the name of your department?",
            name: "addDept",
            when: (answers) => {
                if (answers.options == 'Add Department') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "input",
            message: "What is the title of the role?",
            name: "newRoleTitle",
            when: (answers) => {
                if (answers.options == 'Add Role') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "newRoleSalary",
            when: (answers) => {
                if (answers.options == 'Add Role') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "list",
            message: "What is the Department of the role?",
            name: "newRoleDeptId",
            choices: async (answers) => {
                const [rows, field] = await connection.promise().query('SELECT name FROM department')
                return rows;     
            },
            when: (answers) => {
                if (answers.options == 'Add Role') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "input",
            message: "What is the first name of the employee?",
            name: "newEmpFirst",
            when: (answers) => {
                if (answers.options == 'Add Employee') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "input",
            message: "What is the last name of the employee?",
            name: "newEmployeeLastName",
            when: (answers) => {
                if (answers.options == 'Add Employee') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "list",
            message: "What is the role of the employee",
            name: "newRoleId",
            choices: async (answers) => {
                const [rows, field] = await connection.promise().query(`SELECT title FROM role`)
                const roleArr = [];
                rows.forEach(item => {
                    return roleArr.push(item.title)
                })
                return roleArr;
            },
            when: (answers) => {
                if (answers.options == 'Add Employee') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "list",
            message: "Who is the Manager of the employee",
            name: "newEmpMgr",
            choices: async (answers) => {
                let query1 = `SELECT concat(first_name,' ',last_name) AS manager FROM employee`;
                let query2 = `SELECT concat(first_name,' ',last_name) AS manager FROM employee WHERE manager_id IS NULL`;

                const [rows, field] = await connection.promise().query(query1)
                const managerArray = [];
                rows.forEach(item => {
                    return managerArray.push(item.manager)
                })
                return managerArray;
            },
            when: (answers) => {
                if (answers.options == 'Add Employee') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "list",
            message: "Which employee to update with new role?",
            name: "updatedRoleEmply",
            choices: async (answers) => {
                const [rows, field] = await connection.promise().query(`SELECT concat(first_name,' ',last_name) AS currentEmployee FROM employee `)
                const employeeArray = [];
                rows.forEach(item => {
                    return employeeArray.push(item.currentEmployee)
                })
                return employeeArray;
            },
            when: (answers) => {
                if (answers.options == 'Update Employee Role') {
                    return true;
                } else { return false; }
            }
        },
        {
            type: "list",
            message: "What is the new employee role?",
            name: "updatedRoleId",
            choices: async (answers) => {
                const [rows, field] = await connection.promise().query(`SELECT title FROM role`)
                const roleArr = [];
                rows.forEach(item => {
                    return roleArr.push(item.title)
                })
                return roleArr;
            },
            when: (answers) => {
                if (answers.options == 'Update Employee Role') {
                    return true;
                } else { return false; }
            }
        }
    ])
    .then((answers) => { 
        switch (answers.options) {
            case "Add Department":
                connection.query(
                    `INSERT INTO department (name) VALUES ('${answers.addDept}')`,
                    function (err, results, fields) {
                        restart()
                    }
                )
               // restart()
                break;
        
            case "Add Role":
                // code here
                connection.query(
                    `INSERT INTO role (title,salary,department_id) VALUES('${answers.newRoleTitle}','${answers.newRoleSalary}',(SELECT id FROM department WHERE name='${answers.newRoleDeptId}'))`,
                    function (err, results, fields) {
                        console.log('Role Added!!');
                        restart()
                    }
                )
                break;

            case "Add Employee":
                // code here
                const managerName = answers.newEmpMgr.split(' ')
                
                let myQuery = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES('${answers.newEmployeeFirstName}','${answers.newEmployeeLastName}',(SELECT id FROM role WHERE title='${answers.newRoleId}'),(SELECT id FROM employee emply WHERE emply.first_name='${managerName[0]}' AND emply.last_name='${managerName[1]}'))`;

                connection.query(myQuery,
                    function (err, results, fields) {
                        console.log('Employee Added!!');
                        console.log((err));
                        restart()
                    }
                )
                break;

            case "View Departments":
                connection.promise()
                .query('SELECT * FROM department')
                .then(([rows,fields]) => { 
                    let resultsTbl = cTable.getTable(rows)
                    console.log(`\n${resultsTbl}`);
                    restart()
                })
                .catch((err) => { 
                    console.log(err);
                })
                .then(() => { 
                    connection.end()
                })
                //restart()
                break;

            case "View Roles":
                // code here
                connection.query(
                    'SELECT * FROM role',
                    function (err, results, fields) {
                        let resultsTbl = cTable.getTable(results)
                        console.log(`\n${resultsTbl}`); 
                        restart()
                    }
                )
               // restart()
                break;

            case "View All Employees":
                // code here
                let query1 = 'SELECT * FROM employee';
                let query2 = `SELECT 
                                    emp.id,
                                    emp.first_name,
                                    emp.last_name,
                                    rol.title,
                                    dept.name,
                                    rol.salary,
                                    CONCAT(empy.first_name, ' ', empy.last_name) Manager
                                FROM
                                    employee emp
                                        LEFT JOIN
                                    employee empy ON emp.manager_id = empy.id
                                        JOIN
                                    role rol ON emp.role_id = rol.id
                                        JOIN
                                    department dept ON dept.id = rol.department_id
                                GROUP BY emp.id`
                connection.query(
                    query2,
                    function (err, results, fields) {
                       let resultsTbl = cTable.getTable(results)
                        console.log(`\n${resultsTbl}`); 
                        restart()
                    }
                )
                break;

            case "Update Employee Role":
                // code here
                console.log('Update Employee: ', answers.updatedRoleEmply);
                console.log('New Role: ', answers.updatedRoleId)
                const emply = answers.updatedRoleEmply.split(' ')
                connection.query(
                    `UPDATE employee SET role_id=(SELECT id FROM role WHERE title='${answers.updatedRoleId}' ) WHERE first_name='${emply[0]}' AND last_name='${emply[1]}'`,
                    function (err, results, fields) {
                        console.log('Employee Role Updated!!');
                        restart()
                    }
                )
                break;
              
            case exitTracker:
                // code here
                console.log('Bye!!')
                process.exit()  

            default:
                break;
        }
    })
}

function restart() {
    runEmployeeTracker() 
}

runEmployeeTracker()

