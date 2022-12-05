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

  // This function returns an array of slots that match the filter criteria. The function uses a switch statement to determine the type of the slot property and then filters the slots accordingly. If the slot property is an object, it checks if the object contains the filter property and value. If the slot property is an array, it checks if the array contains any of the filter values. If the slot property is neither an object nor an array, it checks if the filter values include the slot property.