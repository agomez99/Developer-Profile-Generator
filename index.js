const fs = require("fs");
const axios = require('axios');
const inquirer = require("inquirer");
const util = require("util");
const generateHTML = require("./generateHTML");
const writeFileAsync = util.promisify(fs.writeFile);
const pdf = require('html-pdf');

const questions = [{
        type: "input",
        message: "Enter your GitHub username?",
        name: "username"
    },
    {
        type: "list",
        message: "What's your favorite color?",
        name: "color",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ]
    }
];

// Initialize 
function init() {
    inquirer
        .prompt(questions)
        .then(function (input) {
            username = input.username;
            favColor = input.color;
            const queryUrl = `https://api.github.com/users/${username}`;
            return queryUrl;
        })
        .then(function (queryUrl) {
            axios.get(queryUrl)
                .then(function (response) {

                    response.data.color = favColor;
                    // Writes to html file
                    writeToFile(response.data);
                })
                .then(function () {
                    console.log(`Successfully wrote to index.html`);
                })
                .catch(function (error) {
                    console.log("Please enter a valid Github username", error);
                    return;
                });
        });
};


//Writes to index.html 
function writeToFile(info) {
    const html = generateHTML(info);
    writeFileAsync("index.html", html);
    convertToPdf(html);
};

//Converts html = pdf 
function convertToPdf(htmlPdf) {
    options = {
        format: 'Letter'
    };
    pdf.create(htmlPdf, options).toFile('./myPDF.pdf', function (err, res) {
        if (err)
            return console.log(err);
        console.log("Pdf Successfully generated", res);
    })
};


//Starts the process
init();
