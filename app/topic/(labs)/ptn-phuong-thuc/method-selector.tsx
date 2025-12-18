"use client";

import { Search } from "lucide-react";

import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select value={industryL1Id} onValueChange={setIndustryL1Id}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn nhóm ngành..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {L1List.map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Ngành</Label>
        <Select value={industryL3Id} onValueChange={setIndustryL3Id}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn ngành..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0000000">Tổng hợp</SelectItem>
              {L3List.map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Khu vực</Label>
        <Select value={schoolRegion} onValueChange={setSchoolRegion}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn khu vực..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="AL">Cả nước</SelectItem>
              <SelectItem value="NR">Miền Bắc</SelectItem>
              <SelectItem value="CR">Miền Trung</SelectItem>
              <SelectItem value="SR">Miền Nam</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          methodQueryHandler(industryL1Id, industryL3Id, schoolRegion)
        }
      >
        <Search className="button-icon text-green-500" />
      </Button>
    </div>
  );
}
