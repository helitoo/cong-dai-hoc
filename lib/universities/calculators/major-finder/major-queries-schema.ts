import { number, z } from "zod";

export const majorQueriesSchema = z.object({
  schoolIds: z.array(z.string()),
  schoolTypes: z.array(z.enum(["public", "private"])),
  schoolRegions: z.array(z.enum(["HNC", "HCMC", "NR", "SR", "CR"])),
  industryL1Ids: z.array(z.string()),
  industryL3Ids: z.array(z.string()),
  methodIds: z.array(z.string()),
  subjectGroupIds: z.array(z.string()),
  minScore: z.number(),
  scoreMargin: z.number(),
  numberOfReturnedValue: z.number(),
  applyScoreRes: z.boolean(),
  applyHldRes: z.boolean(),
});

export type MajorQueries = z.infer<typeof majorQueriesSchema>;
