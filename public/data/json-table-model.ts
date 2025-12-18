import industryL1 from "@/public/data/industry-l1.json";
import industryL3 from "@/public/data/industry-l3.json";
import methods from "@/public/data/methods.json";
import schools from "@/public/data/schools.json";
import subjectGroups from "@/public/data/subject-groups.json";
import subjects from "@/public/data/subjects.json";
import examDistributions from "@/public/data/exam-distributions.json";

const DATA_MAP = {
  "industry-l1": industryL1,
  "industry-l3": industryL3,
  methods: methods,
  schools: schools,
  "subject-groups": subjectGroups,
  subjects: subjects,
  "exam-distributions": examDistributions,
};

export class JsonTable<T extends Record<string, any>> {
  private data: T[];

  constructor() {
    this.data = [];
  }

  async load(type: keyof typeof DATA_MAP) {
    this.data = DATA_MAP[type] as unknown as T[];
    return this;
  }

  getFields<K extends keyof T>(
    fields: K[]
  ): Array<K extends any ? T[K] : T[K][]> {
    if (fields.length === 1)
      // Chỉ 1 field, trả về mảng các giá trị
      return this.data.map((r) => r[fields[0]]) as any;
    // Nhiều field, trả về mảng các mảng giá trị
    return this.data.map((r) => fields.map((f) => r[f])) as any;
  }

  getValByField<K extends keyof T, V extends T[K], R extends keyof T>(
    currValue: V,
    currField: K,
    targetFields: R[]
  ): T[R] | T[R][] | undefined {
    const row = this.data.find((r) => r[currField] === currValue);

    if (!row) return undefined;

    // Nếu chỉ 1 field -> trả về giá trị đơn
    if (targetFields.length === 1) {
      return row[targetFields[0]];
    }

    // Nhiều field -> trả về array giá trị
    return targetFields.map((tf) => row[tf]);
  }
}
