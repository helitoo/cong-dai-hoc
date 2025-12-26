"use client";

import { Search } from "lucide-react";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { industryL1Table } from "@/lib/universities/convertors/industry-l1";
import { industryL3Table } from "@/lib/universities/convertors/industry-l3";

export default function MethodSelector({
  methodQueryHandler,
}: {
  methodQueryHandler(
    industryL1Id: string,
    industryL3Id: string,
    schoolRegion: string
  ): void;
}) {
  const [industryL1Id, setIndustryL1Id] = useState("714");
  const [industryL3Id, setIndustryL3Id] = useState("0000000");
  const [schoolRegion, setSchoolRegion] = useState("AL");

  const L1List = useMemo(() => industryL1Table.getFields(["id", "name"]), []);

  const L3List = useMemo(() => {
    const list = industryL3Table.getFields(["id", "name"]);
    return list.filter(([id]) => id.startsWith(industryL1Id));
  }, [industryL1Id]);

  return (
    <div className="flex flex-col md:flex-row justify-evenly items-center gap-2 p-2">
      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Nhóm ngành</Label>

        <NativeSelect
          className="w-full"
          value={industryL1Id}
          onChange={(e) => setIndustryL1Id(e.target.value)}
          aria-label="Industry selectpicker"
        >
          {L1List.map(([id, name]) => (
            <NativeSelectOption key={id} value={id}>
              {name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Ngành</Label>

        <NativeSelect
          className="w-full"
          value={industryL3Id}
          onChange={(e) => setIndustryL3Id(e.target.value)}
          aria-label="Major selectpicker"
        >
          <NativeSelectOption value="0000000">Tổng hợp</NativeSelectOption>
          {L3List.map(([id, name]) => (
            <NativeSelectOption key={id} value={id}>
              {name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Khu vực</Label>

        <NativeSelect
          className="w-full"
          value={schoolRegion}
          onChange={(e) => setSchoolRegion(e.target.value)}
          aria-label="School region selectpicker"
        >
          <NativeSelectOption value="AL">Cả nước</NativeSelectOption>
          <NativeSelectOption value="NR">Miền Bắc</NativeSelectOption>
          <NativeSelectOption value="CR">Miền Trung</NativeSelectOption>
          <NativeSelectOption value="SR">Miền Nam</NativeSelectOption>
        </NativeSelect>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          methodQueryHandler(industryL1Id, industryL3Id, schoolRegion)
        }
        aria-label="Search"
      >
        <Search className="button-icon text-green-500" />
      </Button>
    </div>
  );
}
