import { CirclePlus, Trash } from "lucide-react";
import {
  Control,
  Controller,
  useFieldArray,
  useWatch,
  UseFormSetValue,
} from "react-hook-form";

import Quote from "@/components/quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScoreData } from "@/lib/universities/calculators/score-data/score-schema";

import {
  aLevelValidator,
  ieltsValidator,
  scoreValidator,
} from "@/lib/universities/calculators/score-data/score-schema";

export default function CertificationsForm({
  control,
  setValue,
}: {
  control: Control<ScoreData>;
  setValue: UseFormSetValue<ScoreData>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const certTypes = useWatch({
    control,
    name: "certifications",
  });

  return (
    <div className="flex flex-col gap-4">
      <Quote type="tip">
        <ul className="list-disc space-y-3">
          <li className="ml-5">
            Nếu bạn{" "}
            <strong>có chứng chỉ ngoại ngữ nhưng không phải IELTS</strong> /
            Không rõ cách quy đổi, hãy tham khảo bảng quy đổi của ULIS, HUST,
            các trường khác cũng có quy định tương tự.
          </li>
          <li className="ml-5">
            Đối với <strong>chứng chỉ A-level</strong>: Nhập điểm chữ (A*, A, B,
            C, D, E, U).
          </li>
        </ul>
      </Quote>

      <Quote type="warning">
        Chứng chỉ quốc tế phải còn hạn sử dụng cho đến thời điểm đăng ký xét
        tuyển.
      </Quote>

      {fields.map((field, idx) => (
        <div key={field.id} className="flex gap-3 items-end">
          <div className="w-2/5 space-y-1">
            <Label>Loại</Label>
            <Controller
              control={control}
              name={`certifications.${idx}.type`}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);

                    // reset score
                    setValue(`certifications.${idx}.score`, "", {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sat">SAT</SelectItem>
                    <SelectItem value="act">ACT</SelectItem>
                    <SelectItem value="alevel">A-Level</SelectItem>
                    <SelectItem value="ib">IB</SelectItem>
                    <SelectItem value="ielts">IELTS</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="w-2/5 space-y-1">
            <Label>Điểm (số)</Label>
            <Controller
              control={control}
              name={`certifications.${idx}.score`}
              render={({ field }) => (
                <Input
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    switch (certTypes[idx]?.type) {
                      case "sat":
                        field.onChange(
                          scoreValidator(e.target.value, 400, 1600, true)
                        );
                        return;

                      case "act":
                        field.onChange(
                          scoreValidator(e.target.value, 1, 36, true)
                        );
                        return;

                      case "alevel":
                        field.onChange(aLevelValidator(e.target.value));
                        return;

                      case "ib":
                        field.onChange(
                          scoreValidator(e.target.value, 1, 45, true)
                        );
                        return;

                      case "ielts":
                        field.onChange(ieltsValidator(e.target.value));
                        return;
                    }
                  }}
                />
              )}
            />
          </div>

          <Button onClick={() => remove(idx)} variant="ghost" size="icon">
            <Trash className="button-icon text-red-500" />
          </Button>
        </div>
      ))}

      <div className="w-full flex justify-center">
        <Button
          onClick={() => append({ type: "ielts", score: 6 })}
          variant="ghost"
          size="icon"
        >
          <CirclePlus className="button-icon text-green-500" />
        </Button>
      </div>
    </div>
  );
}
