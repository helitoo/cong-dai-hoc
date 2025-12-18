"use client";

import { compareTwoStrings } from "@/lib/universities/general-helpers/string-similarity";

export type BestMatchRes = {
  id: string;
  name: string;
};

export function getExactData(
  currName: string,
  comparingNames: string[],
  ids: string[]
): BestMatchRes {
  let ans: BestMatchRes = {
    id: "",
    name: "",
  };
  let bestMatchRatio = -1;

  if (ids.length != comparingNames.length) return ans;

  comparingNames.forEach((name, index) => {
    const currRatio = compareTwoStrings(currName, name);

    if (currRatio > bestMatchRatio) {
      bestMatchRatio = currRatio;
      ans = {
        id: ids[index],
        name: name,
      };
    }
  });
  return ans;
}
