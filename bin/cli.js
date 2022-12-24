#!/usr/bin/env node

import fs from 'fs';
import { Command } from "commander";
import start from "./commands/start.js"
import report from "./commands/report.js";
import stop from "./commands/stop.js";

const path = "bin/report.json";

const json_string = await fs.promises.readFile(path);
const RAW_DATA = await JSON.parse(json_string);

const program = new Command();

program
  .name("time-tracker")
  .description("Human readable time tracking")
  .version("0.0.1");

program
  .command("report")
  .option('-i, --id [id]', 'specify id')
  .option('-p, --project [project]', 'specify project')
  .option('-t, --tags [tags...]', 'specify tags')
  .option('-b, --billable', 'specify if project is billable')
  .description("Start tracking")
  .action(async (options) => {
    console.log(report(await RAW_DATA, options))
  });

  program
  .command("start")
  .argument('<name>', 'Specify project name')
  .option('-t, --tags [tags...]', 'specify tags')
  .option('-b, --billable', 'specify if project is billable')
  .description("Start tracking")
  .action(async (name, options) => {
    console.log(start(await RAW_DATA, name, options.tags, options.billable))
  });

  program
  .command("stop")
  .description("Stop tracking")
  .action(async () => {
    console.log(stop(await RAW_DATA))
  });


  program.parse();