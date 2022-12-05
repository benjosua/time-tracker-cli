

export default function edit(data, ids, property, value) {

    // edit 4d4cb301,4d4cbb2e start 2022-12-02T22:43:16.761+01:00
    // edit 4d4cb301,4d4cbb2e end 2022-12-02T22:43:16.761+01:00
    // edit 4d4cb301,4d4cbb2e project "Lorem 3"
    // edit 4d4cb301,4d4cbb2e tags 1,2,5

    const newSlot = {
        id: Date.now().toString(16).slice(2, 10),
        project: projectName,
        start: DateTime.now().toString(),
        end: "",
        tags: tags,
        is_billable: billable || false,
      };
      
}