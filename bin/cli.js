#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
  .name("time-tracker")
  .description("Human readable time tracking")
  .version("0.0.1");

program
  .command("report")
  .option('-i, --id [id]', 'specify id')
  .option('-n, --names [names...]', 'specify names')
  .option('-t, --tags [tags...]', 'specify tags')
  .option('-t, --tags [tags...]', 'specify tags')
  .option('-b, --billable', 'specify tags')
  .description("Start tracking")
  .action((options) => {
    console.log(options)
  });

  program.parse();