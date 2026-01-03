"use client";

import { CirclePlus, Trash } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { industryL1Table } from "@/lib/universities/convertors/industry-l1";
import { industryL3Table } from "@/lib/universities/convertors/industry-l3";

import type { MajorQueries } from "@/lib/universities/calculators/major-finder/major-queries-schema";

type IndustryRow = {
  l1: string;
  l3: string;
};

export function IndustrySelect({
  setValue,
}: {
  setValue: UseFormSetValue<MajorQueries>;
}) {
  const [rows, setRows] = useState<IndustryRow[]>([]);

  const L1List = useMemo(() => industryL1Table.getFields(["id", "name"]), []);

  const L3All = useMemo(() => industryL3Table.getFields(["id", "name"]), []);

  // Sync UI data to form
  function syncToForm(nextRows: IndustryRow[]) {
    const l1Ids: string[] = [];
    const l3Ids: string[] = [];

    for (const r of nextRows) {
      if (r.l3) l3Ids.push(r.l3);
      else if (r.l1) l1Ids.push(r.l1);
    }

    setValue("industryL1Ids", l1Ids, { shouldDirty: true });
    setValue("industryL3Ids", l3Ids, { shouldDirty: true });

    // console.log("L1: ", l1Ids, "L3: ", l3Ids);
  }

  useEffect(() => {
    syncToForm(rows);
  }, [rows]);

  function updateRow(index: number, patch: Partial<IndustryRow>) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };

      // nếu đổi L1 → reset L3
      if (patch.l1 !== undefined) {
        next[index].l3 = "";
      }

      return next;
    });
  }

  function addRow() {
    setRows((prev) => [...prev, { l1: "714", l3: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ l1: "", l3: "" }];
    });
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {rows.map((row, index) => {
        const L3List = row.l1
          ? L3All.filter(([id]) => id.startsWith(row.l1))
          : [];

        return (
          <div key={index} className="flex items-end gap-2">
            {/* L1 */}
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-xs">Nhóm ngành</Label>
              <NativeSelect
                value={row.l1}
                onChange={(e) => updateRow(index, { l1: e.target.value })}
                className="w-full"
              >
                {L1List.map(([id, name]) => (
                  <NativeSelectOption key={id} value={id}>
                    {name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            {/* L3 */}
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-xs">Ngành</Label>
              <NativeSelect
                value={row.l3}
                disabled={!row.l1}
                onChange={(e) => updateRow(index, { l3: e.target.value })}
                className="w-full"
              >
                <NativeSelectOption value="">Tất cả ngành</NativeSelectOption>
                {L3List.map(([id, name]) => (
                  <NativeSelectOption key={id} value={id}>
                    {name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRow(index)}
            >
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        );
      })}

      <Button type="button" variant="ghost" size="icon" onClick={addRow}>
        <CirclePlus className="button-icon text-green-500" />
      </Button>
    </div>
  );
}
