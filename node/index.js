const express = require('express');
const fakerjs = require('@faker-js/faker');
const app = express();
const port = 3000;
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);
const createTable = `
  CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT,name varchar(255) NOT NULL,PRIMARY KEY(id))`;
connection.query(createTable);

const inserPerson = `INSERT INTO people(name) values('${fakerjs.faker.person.firstName()}')`;
connection.query(inserPerson);

connection.end();

const getPeople = async () => {
  try {
    const connection = mysql.createConnection(config);

    const allPerson = `SELECT * FROM people`;
    const people = await new Promise((resolve, reject) => {
      connection.query(allPerson, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const resultsAsObjects = results.map((row) => ({ ...row }));
          resolve(resultsAsObjects);
        }
      });
    });
    connection.end();
    const peopleComponet = `<table>
    <tbody>${
      people
        .map(
          (person) => `
    <tr><td style='padding: 5px;
  border: 1px solid black;'>${person.name}</td></tr>`,
        )
        .join('') ?? '<tr></tr>'
    }</tbody>
    </table>`;
    return peopleComponet;
  } catch (error) {
    throw error;
  }
};

app.get('/', async (req, res) => {
  try {
    const title = '<h1>Full Cycle</h1>';
    const listPeopleComponent = await getPeople();

    const response = await new Promise((resolve, reject) => {
      resolve(`${title}<br/>${listPeopleComponent}`);
    });

    res.send(response);
  } catch (error) {
    res.status(400).send('Bad Request');
  }
});

app.listen(port, () => {
  console.log('Rodando na porta ' + port);
});
