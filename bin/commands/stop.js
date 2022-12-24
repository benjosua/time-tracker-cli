import { DateTime, Duration } from "luxon";
import chalk from "chalk";
import fs from "fs";

export default function stop(data) {

  const isOpen = data.find((project) => Object.values(project).includes(""));
  const isOpenIndex = data.findIndex((project) => Object.values(project).includes(""));

  if(!isOpen) {
    return chalk.red("You need to start a new slot before stopping it")
  } else {
    data[isOpenIndex].end = DateTime.now().toString();

    const dataString = JSON.stringify(data);
    fs.writeFile("./report.json", dataString, (err) => {
      if (err) {
        throw err;
      }
    });
    return chalk.green(
      `Last open slot (${isOpen.id}) was stopped at ${DateTime.now().toLocaleString(
        DateTime.DATETIME_SHORT_WITH_SECONDS
      )}`
    );
  }
}
