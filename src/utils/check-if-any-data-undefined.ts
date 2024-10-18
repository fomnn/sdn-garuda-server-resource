import { ParentInterface } from "../types/Parent";

export default function checkIfAnyDataUndefined(parent: ParentInterface)  {
  // Loop through all the properties of the object
  for (const key in parent) {
    if (parent.hasOwnProperty(key)) {
      const value = (parent as any)[key]; // Access value dynamically

      // Check if the value is undefined, null, or an empty string
      if (value === undefined || value === null || value === "") {
        return true; // If any field is empty, return true
      }
    }
  }
  return false; // If no empty field is found, return false
}
