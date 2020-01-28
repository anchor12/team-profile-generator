const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const util = require("util");
var cardHTMLArray = [];

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the employee name?"
        },
        {
            type: "list",
            name: "title",
            message: "What is the employee title?",
            choices: ['Engineer', 'Intern', "Manager"]
        },
        {
            type: "input",
            name: "id",
            message: "What is the employee ID number?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the employees email address?"
        }

    ])
}

function engineerQuestions() {
    return inquirer.prompt({
        type: "input",
        name: "github",
        message: "What is your Github username?"
    })
}

function internQuestions() {
    return inquirer.prompt({
        type: "input",
        name: "school",
        message: "What is your school's name?"
    })
}

function managerQuestions() {
    return inquirer.prompt({
        type: "input",
        name: "officeNumber",
        message: "What is your office number?"
    })
}

async function promptToEnterAnotherEmployee() {
    return inquirer.prompt({
        type: "list",
        name: "again",
        message: "Do you want to input another employee?",
        choices: ['Yes', "No"]
    })
}

async function shouldMakeAnotherEmployee() {
    answer = await promptToEnterAnotherEmployee()
    return answer.again === 'Yes'
}

async function init() {

    employees = []
    var managerCount = 0;
    do {
        try {
            const answers = await promptUser();
            if (answers.title === 'Engineer') {
                engineerAnswers = await engineerQuestions();
                employees.push(
                    new Engineer(answers.id, answers.name, answers.title, engineerAnswers.github, answers.email))
            }
            else if (answers.title === 'Intern') {
                internAnswers = await internQuestions();
                employees.push(
                    new Intern(answers.id, answers.name, answers.title, internAnswers.school, answers.email))
            }
            else if (answers.title === 'Manager') {
                if (managerCount >= 1) {
                    console.log("There can only be a single manager in the team.")
                }
                else {
                    managerAnswers = await managerQuestions();
                    employees.push(
                        new Manager(answers.id, answers.name, answers.title, managerAnswers.officeNumber, answers.email))
                    managerCount++;
                }
            }

            

            console.log("Successfully wrote to index.html");
        } catch (err) {
            console.log(err);
        }
    }
    while (await shouldMakeAnotherEmployee())
    console.log(employees);

    const html = generateHTML(employees);
    await writeFileAsync("index.html", html);
}

class Employee {
    constructor(name, id, title, email) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.email = email;

    }
    getName() {
        return name;
    }
    getId() {
        return id;
    }
    getEmail() {
        return email;
    }
    getRole() {
        return 'Employee';
    }
}

class Manager extends Employee {
    constructor(id, name, title, officeNumber, email) {
        super(name, id, title, email);
        this.officeNumber = officeNumber;
    }
    getRole() {
        return 'Manager';
    }
}

class Engineer extends Employee {
    constructor(id, name, title, github, email) {
        super(name, id, title, email);
        this.github = github;
    }
    getGithub() {
        return github;
    }
    getRole() {
        return 'Engineer';
    }
}


class Intern extends Employee {
    constructor(id, name, title, school, email) {
        super(name, id, title, email);
        this.school = school;
    }
    getSchool() {
        return school;
    }
    getRole() {
        return 'Intern';
    }
}

init();
function employeeCards(employees) {
    for (var i = 0; i < employees.length; i++) {
        cardHTMLArray.push(`<div class="card" style="width: 18rem;">
  
  <div class="card-body">
    <h5 class="card-title">${employees[i].name} - ${employees[i].title}</h5>
    <p class="card-text">${Object.keys(employees[i])[0]} - ${Object.values(employees[i])[0]}</p>
    <p class="card-text">${Object.keys(employees[i])[3]} - ${Object.values(employees[i])[3]}</p>
    <p class="card-text">${Object.keys(employees[i])[4]} - ${Object.values(employees[i])[4]}</p>
    
  </div>
</div>`)
    };
    console.log(cardHTMLArray);
    return cardHTMLArray.join(" ");
}

function generateHTML(employees) {

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <title>Team Profile</title>
    </head>
    <body>
    <div class="header" style="height:80px; width: 100%; background-color:red; 
        color: white; text-align: center; font-family: Arial; font-size: 2.5em">My Team</div>
      
        <div style="display:flex; flex-direction: row; flex-wrap: wrap;">
        ${employeeCards(employees)}
        </div>
     
    </div>
    </body>
    </html>`;
};