import { DateTime, Duration } from "luxon";
import chalk from "chalk";
import fs from "fs";
import { homedir } from "os";

export default function start(data, projectName, tags, billable) {
  
  const newSlot = {
    id: Date.now().toString(16).slice(2, 10),
    project: projectName,
    start: DateTime.now().toString(),
    end: "",
    tags: tags ? tags : [],
    is_billable: billable || false,
  };

  // get all tags from all slots then filter to get all unique ones
  const Tags = data
    .flatMap((slot) => slot.tags)
    .filter((v, i, a) => a.indexOf(v) === i);

  const isOpen = data.find((project) => Object.values(project).includes(""));
  // const projectExists = data.some((object) => object.project === projectName);

  if (typeof isOpen !== "undefined") {
    return chalk.red(`End slot ${isOpen.id} before starting a new slot`);
  } else {
    // print new project name when project doesnt exist yet
    if (!data.some((slot) => slot.project === projectName)) {
      console.log(`Note: "${projectName}" is a new project`);
    }

    // print new tags if there are any
    let newTags;
    if (tags) {
      newTags = tags.filter((i) => Tags.indexOf(i) < 0);
      if (newTags.length > 1) {
        console.log(`Note: ${newTags.join(", ")} are new tags`);
      } else if (newTags.length > 0) {
        console.log(`Note: ${newTags[0]} is a new tag`);
      }
    }

    data.push(newSlot);

    // get path for data file in user home directory
    const userHomeDir = homedir();
    const path = userHomeDir + "/.timez/data.json";

    const dataString = JSON.stringify(data);
    fs.writeFile(path, dataString, (err) => {
      if (err) {
        throw err;
      }
    });
    return chalk.green(
      `Slot was created at ${DateTime.now().toLocaleString(
        DateTime.DATETIME_SHORT_WITH_SECONDS
      )}`
    );
  }
}
