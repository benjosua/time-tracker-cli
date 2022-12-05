import { DateTime, Duration } from "luxon";
import chalk from "chalk";
import { table } from "table";

export default function report(data) {

  const header = [
    chalk.green.bold("ID"),
    chalk.green.bold("Project"),
    chalk.green.bold("Start"),
    chalk.red.bold("End"),
    chalk.yellow.bold("Tags"),
    chalk.blue.bold("Billable"),
    chalk.green.bold("Duration"),
  ];

  const slotDurations = data.map((x) =>
    x.end == ""
      ? DateTime.now().diff(DateTime.fromISO(x.start)).toObject()
      : DateTime.fromISO(x.end).diff(DateTime.fromISO(x.start)).toObject()
  );

  // console.log(slotDurations)
  // [{ milliseconds: 26 },
  // { milliseconds: 11 },
  // { milliseconds: 11 }]

  const totalTime = slotDurations.reduce(
    (previousValue, currentValue) => previousValue.plus(currentValue),
    Duration.fromObject({ milliseconds: 0 })
  );
  // { milliseconds: SUM }

  const footer = [
    "Total:",
    "",
    "",
    "",
    "",
    "",
    chalk.green(totalTime.rescale().toHuman()),
  ];

  // add duration key
  const formatted = data.map((v) => ({
    ...v,
    Duration:
      v.end == ""
        ? DateTime.now().diff(DateTime.fromISO(v.start)).rescale().toHuman()
        : DateTime.fromISO(v.end)
            .diff(DateTime.fromISO(v.start))
            .rescale()
            .toHuman(),
    is_billable: v.is_billable == false ? chalk.red("No") : chalk.green("Yes"),
  }));

  // format start and end from iso to human readable strings
  const keysToChange = ["start", "end"];

  formatted.forEach((x) => {
    for (let key of keysToChange) {
      DateTime.fromISO(x[key]).isValid == false
        ? (x[key] = chalk.green("Open"))
        : (x[key] = DateTime.fromISO(x[key]).toLocaleString(
            DateTime.TIME_24_WITH_SECONDS
          ));
    }
  });

  // convert objects to table array
  // console.log(formatted)
  const slots = formatted.map((obj) => Object.values(obj));
  // console.log(slots)


  slots.unshift(header);
  slots.push(footer);

  const config = {
    header: {
      alignment: "center",
      content: chalk.whiteBright("Report"),
      //   content: chalk.blue(projectName) + ` | Total time on project: ${totalTime.rescale().toHuman()}`,
    },
    spanningCells: [
      { col: 0, row: slots.length - 1, colSpan: 6, alignment: "right" },
    ],
    // columns: [
    //     { alignment: 'center'},
    //     { alignment: 'center'},
    //     { alignment: 'center'},
    //     { alignment: 'center'},
    //     { alignment: 'center'},
    //   ]
  };

  return table(slots, config);
}
