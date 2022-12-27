import { table, getBorderCharacters } from "table";
import fs from "fs";
import chalk from "chalk";
import multiFilter from "./bin/commands/search.js"
import { homedir } from 'os'

const userHomeDir = homedir()

const path = userHomeDir + "/.timez/data.json";

const json_string = await fs.promises.readFile(path);
const RAW_DATA = await JSON.parse(json_string);

const mapValues = (object, mapFn) => {
    return Object.entries(object).reduce((acc, [key, value]) => {
      acc[key] = mapFn(value);
      return acc;
    }, {});
  };

const tableBorder = mapValues(getBorderCharacters('honeywell'), (char) => {
    return chalk.gray(char);
  });

const headerID = `544346f4, 5443T6f3`

const bodyID = [
    [chalk.blue('ID'), chalk.white('Project'), chalk.white('Start'), chalk.white('End'), chalk.white('Tags'), chalk.white('Is_billable'), chalk.white('Duration')],
    ['544346f4', 'Cafe', '13:53:05', '13:56:05', 'Red, Green, 2022', chalk.green(`Yes`), '3 minutes'],
    ['5443T6f3', 'Blue 33', '13:53:05', '13:56:05', 'Red, Green, 2022', chalk.red(`No`), '3 minutes']
];

const configID = {
    header: {
      alignment: "center",
      content: chalk.bold(`${headerID}`),
    }
};

// Report table for ID
console.log(chalk.green(`Report for IDs`))
console.log(table(bodyID, configID));

const headerTags = `Red, Green`

const bodyTags = [
    ['ID', 'Project', 'Date', 'Start', 'End', 'Tags', 'Is_billable', 'Duration'],
    ['544346f4', 'Cafe', '13:53:05', '13:56:05', 'Red, Green, 2022', chalk.green(`Yes`), '3 minutes'],
    ['5443T6f3', 'Blue 33', '13:53:05', '13:56:05', 'Red, Green, 2022', chalk.red(`No`), '3 minutes']
];

const configTags = {
    border: tableBorder,
    header: {
      alignment: "center",
      content: chalk.bold(`${headerTags}`),
    }
  };

// Report table for ID
console.log(chalk.green(`Report for:Tags`))
console.log(table(bodyID, configTags));

// TODO add date row

console.log(multiFilter(await RAW_DATA, { tags: ["yes"]}))
