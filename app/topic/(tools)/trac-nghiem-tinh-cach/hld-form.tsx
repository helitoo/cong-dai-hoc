"use client";

import { useFieldArray, useForm } from "react-hook-form";

import HldDataManager from "@/app/topic/(tools)/trac-nghiem-tinh-cach/hld-data-manager";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import HldRes from "@/app/topic/(tools)/trac-nghiem-tinh-cach/hld-res";
import type { HldQuestions } from "@/lib/universities/calculators/holland-data/hld-questions";
import { hldQuestions } from "@/lib/universities/calculators/holland-data/hld-questions";

export default function HldForm() {
  const form = useForm<HldQuestions>({
    defaultValues: {
      hldQuestions,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "hldQuestions",
  });

  return (
    <>
      <Form {...form}>
        <form className="space-y-10">
          {fields.map((opn, opnIndex) => (
            <div key={opn.id} className="space-y-4">
              {/* topic */}
              <div className="flex">
                <div className="flex items-center justify-center w-20 p-2 bg-sky-500">
                  <span className="text-white font-semibold">
                    Câu {opnIndex + 1}/{hldQuestions.length}
                  </span>
                </div>
                <div className="pl-5 p-2 bg-muted w-full font-semibold">
                  {hldQuestions[opnIndex].topic}
                </div>
              </div>

              {/* 6 freqNodes */}
              {hldQuestions[opnIndex].freqNodes.map((freq, freqIndex) => (
                <FormField
                  key={freqIndex}
                  control={form.control}
                  name={`hldQuestions.${opnIndex}.freqNodes.${freqIndex}.score`}
                  render={({ field }) => (
                    <FormItem className="md:ml-20">
                      <FormLabel className="font-normal p-1">
                        <div className="font-bold bg-muted p-1 rounded-full">
                          {opnIndex + 1}.{freqIndex + 1}/6
                        </div>
                        {freq.label}
                      </FormLabel>

                      <FormControl>
                        <RadioGroup
                          value={field.value?.toString()}
                          onValueChange={(val) => field.onChange(Number(val))}
                          className="ml-10 mt-0 md:flex md:items-center md:justify-start md:gap-5"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="-1" id="-1" />
                            <Label
                              htmlFor="-1"
                              className="font-normal text-sm text-muted-foreground italic"
                            >
                              Sai nhiều hơn đúng
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="0" />
                            <Label
                              htmlFor="0"
                              className="font-normal text-sm text-muted-foreground italic"
                            >
                              Trung lập
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="1" />
                            <Label
                              htmlFor="1"
                              className="font-normal text-sm text-muted-foreground italic"
                            >
                              Đúng nhiều hơn sai
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          ))}
        </form>
      </Form>

      <HldRes form={form} />

      <HldDataManager form={form} />
    </>
  );
}
