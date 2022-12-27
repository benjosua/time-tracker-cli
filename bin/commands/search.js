export default function multiFilter (slots, filters) {
  return slots.filter((slot) => {
    return Object.entries(filters).every(([filterProperty, filterValues]) => {
      switch (Object.prototype.toString.call(slot[filterProperty])) {
        case "[object Object]":
          return Object.entries(filterValues).every(
            ([extFilterProperty, extFilterValue]) => {
              return (
                new Map(Object.entries(slot[filterProperty])).get(
                  extFilterProperty
                ) === extFilterValue
              );
            }
          );

        case "[object Array]":
          return slot[filterProperty].some((slotValue) => {
            return filterValues.includes(slotValue);
          });

        default:
          return filterValues.includes(slot[filterProperty]);
      }
    });
  });
};
