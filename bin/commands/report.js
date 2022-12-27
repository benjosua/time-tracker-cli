import { DateTime, Duration } from "luxon";
import { table } from "table";
import chalk from "chalk";
import { cleanUnits } from "../utils.js";
import multiFilter from "./search.js";

export default function report(data, filter) {
  const keys = Object.keys(filter);

  const title = Object.entries(filter)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            value = value.join(", ");
          }
          return `${key}: ${value}`;
        })
        .join(" | ");

  // if no filter is provided return current running slot time
  if (keys.length === 0) {
    const isOpen = data.find((project) => Object.values(project).includes(""));
    const isOpenIndex = data.findIndex((project) =>
      Object.values(project).includes("")
    );

    if (!isOpen) {
      return chalk.red(
        `Theres no slot running. If you want to filter for a specific project or property use "report --help"`
      );
    } else {
      const runTime = DateTime.now()
        .diff(DateTime.fromISO(data[isOpenIndex].start))
        .rescale()
        .toHuman();
      return chalk.green(
        `ID: ${isOpen.id} running since ${runTime} in project ${isOpen.project}`
      );
    }
  }

  // check if only one project id is reqested
    const result = multiFilter(data, filter);

    if (result.length <= 0) {
      return chalk.red(`There is no slot with ${title}`);
    } else {
      const slotDurations = result.map((x) =>
        x.end == ""
          ? DateTime.now().diff(DateTime.fromISO(x.start)).toObject()
          : DateTime.fromISO(x.end).diff(DateTime.fromISO(x.start)).toObject()
      );

      const totalTime = slotDurations.reduce(
        (previousValue, currentValue) => previousValue.plus(currentValue),
        Duration.fromObject({ milliseconds: 0 })
      );

      // add duration key and format is_billable from boolean to yes / no
      const addDurationAndFormatBillable = result.map((v) => ({
        ...v,
        // date: v.start.toLocaleString(DateTime.DATE_MED),
        date: DateTime.fromISO(v.start).toLocaleString(DateTime.DATE_MED),
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

      let tableHeader = Object.keys(
        Object.assign({}, ...addDurationAndFormatBillable)
      );

      function capitalizeWords(arr) {
        return arr.map((element) => {
          return (
            element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()
          );
        });
      }

      let capitalizedTableHeader = capitalizeWords(tableHeader);

      // { milliseconds: SUM } alle durations zsm

      const withoutMilliseconds = totalTime
        .rescale()
        .set({ milliseconds: 0 })
        .toObject();

      const footer = [
        "∑",
        "",
        "",
        "",
        "",
        "",
        "",
        chalk.green(
          Duration.fromObject(cleanUnits(withoutMilliseconds)).toHuman()
        ),
      ];

      // color the tableHeader

      // color configuration

      const colors = {
        id: "blue",
        project: "red",
        start: "bold",
        end: "red",
        tags: "blue",
        is_billable: "yellow",
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
      const slots = addDurationAndFormatBillable.map((obj) =>
        Object.values(obj)
      );

      slots.unshift(capitalizedTableHeader);
      slots.push(footer);

      const config = {
        header: {
          alignment: "center",
          content: chalk.whiteBright(`${title}`),
        },
        spanningCells: [
          { col: 0, row: slots.length - 1, colSpan: 6, alignment: "right" },
        ],
      };

      return table(slots, config);
    }
}
