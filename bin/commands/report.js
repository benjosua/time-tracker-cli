import { DateTime, Duration } from "luxon";
import { table } from "table";
import chalk from "chalk";

export default function report(data, filter) {

  // check if only one project id is reqested
  let keys = Object.keys(filter);
  let key = keys[0];

  if (keys.length == 1 || key == "id") {
    const framesWithID = data.filter(
      (object) => object.project === filter.project
    );

    const slotDurations = framesWithID.map((x) =>
      x.end == ""
        ? DateTime.now().diff(DateTime.fromISO(x.start)).toObject()
        : DateTime.fromISO(x.end).diff(DateTime.fromISO(x.start)).toObject()
    );

    const totalTime = slotDurations.reduce(
      (previousValue, currentValue) => previousValue.plus(currentValue),
      Duration.fromObject({ milliseconds: 0 })
    );

    // add duration key and format is_billable from boolean to yes / no
    const addDurationAndFormatBillable = framesWithID.map((v) => ({
      ...v,
      duration:
        v.end == ""
          ? DateTime.now().diff(DateTime.fromISO(v.start)).rescale().toHuman()
          : DateTime.fromISO(v.end)
              .diff(DateTime.fromISO(v.start))
              .rescale()
              .toHuman(),
      is_billable:
        v.is_billable == false ? chalk.red("No") : chalk.green("Yes"),
    }));

    let tableHeader = Object.keys(Object.assign({}, ...addDurationAndFormatBillable));

    // { milliseconds: SUM } alle durations zsm

    const footer = [
      "Total:",
      "",
      "",
      "",
      "",
      "",
      chalk.green(totalTime.rescale().toHuman()),
    ];

    // color the tableHeader

    // color configuration

    const colors = {
      id: "bold",
      project: "bold",
      start: "bold",
      end: "bold",
      tags: "bold",
      is_billable: "bold",
      duration: "bold",
    };

    // if tableHeader colum is in color config recolor with chalk

    tableHeader = tableHeader.map((string) => {
      if (string in colors) {
        return chalk[colors[string]](string);
      } else {
        return string;
      }
    });

    // format start and end from iso to human readable strings
    const keysToChange = ["start", "end"];

    addDurationAndFormatBillable.forEach((x) => {
      for (let key of keysToChange) {
        DateTime.fromISO(x[key]).isValid == false
          ? (x[key] = chalk.green("Open"))
          : (x[key] = DateTime.fromISO(x[key]).toLocaleString(
              DateTime.TIME_24_WITH_SECONDS
            ));
      }
    });

    // convert objects to table array
    const slots = addDurationAndFormatBillable.map((obj) => Object.values(obj));

    slots.unshift(tableHeader);
    slots.push(footer);

    const config = {
      header: {
        alignment: "center",
        content: chalk.whiteBright(`${filter.project}`),
      },
      spanningCells: [
        { col: 0, row: slots.length - 1, colSpan: 6, alignment: "right" },
      ],
    };
    console.log(slots)
    console.log(table(slots, config))

    return table(slots, config);
  } else {
    // handle if multiple filters are specified
  }
}
