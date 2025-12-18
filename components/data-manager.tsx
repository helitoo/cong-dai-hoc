"use client";

import { Check, Clipboard, RotateCcw, SquarePlay } from "lucide-react";

import { useEffect, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import Quote from "@/components/quote";
import showToast from "@/components/toastify-wrapper";
import ToggleButton from "@/components/toggle-button/toggle-button";

type DataManagerProps = {
  getEncodedData: () => string;
  setDataToPage: (data: string) => void;
  resetDataOnPage: () => void;
  setDataToBrowser: (data: string) => void;
  className?: string;
};

export default function DataManager({
  getEncodedData,
  setDataToPage,
  resetDataOnPage,
  setDataToBrowser,
  className = "",
}: DataManagerProps) {
  const [data, setData] = useState("");

  async function copyCodeHandler() {
    const encodedData = getEncodedData();
    setData(encodedData);
    await navigator.clipboard.writeText(encodedData);
  }

  async function exeCodeHandler() {
    let temp = data;
    if (data) setDataToPage(temp);
    else {
      temp = await navigator.clipboard.readText();
      if (!temp)
        showToast({ type: "error", message: "KHÔNG tìm thấy dữ liệu!" });
      else {
        setData(temp);
        setDataToPage(temp);
      }
    }
  }

  // Save data before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const encodedData = getEncodedData();
      setData(encodedData);
      setDataToBrowser(encodedData);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className={`box mt-5 ${className}`}>
      <div className="flex justify-start items-center">
        <h1 className="box-title">Trình quản lý dữ liệu</h1>
      </div>

      <p className="text-sm italic text-muted-foreground">
        Để thuận tiện lưu trữ dữ liệu, trang web còn cung cấp tính năng{" "}
        <em>"Tạo code"</em>. Code là một dãy ký tự mã hóa dữ liệu mà bạn đã nhập
        vào web. cậu có thể lưu code này cho các lần dùng sau hoặc chia sẻ cho
        cậu bè để khỏi nhập lại thông tin.
      </p>

      <Quote type="note">
        <ul className="list-disc text-muted-foreground italic">
          <li className="ml-5">
            Khung bên dưới là dành để nhập code, không viết tùy tiện vào đó.
          </li>
          <li className="ml-5">
            Để nhập code, bạn có thể paste code vào khung bên dưới hoặc giữ nó
            trong clipboard đều được.
          </li>
        </ul>
      </Quote>

      <Textarea
        placeholder="Viết bậy bạ vào đây có thể làm hỏng Web..."
        value={data}
        onChange={(e) => {
          setData(e.target.value);
        }}
        className="mt-5"
      />

      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
        <ToggleButton
          variant="outline"
          className="w-fit p-1 px-2"
          notExeIcon={
            <>
              <Clipboard className="button-icon" /> Tạo & chép code
            </>
          }
          exeIcon={
            <>
              <Check className="button-icon text-green-500" /> Đã Tạo & chép
              code
            </>
          }
          onClick={copyCodeHandler}
        />

        <ToggleButton
          variant="outline"
          className="w-fit p-1 px-2"
          notExeIcon={
            <>
              <SquarePlay className="button-icon" /> Nhập code
            </>
          }
          exeIcon={
            <>
              <Check className="button-icon text-green-500" /> Đã nhập code
            </>
          }
          onClick={exeCodeHandler}
        />

        <ToggleButton
          variant="outline"
          className="w-fit p-1 px-2"
          notExeIcon={
            <>
              <RotateCcw className="button-icon" /> Reset dữ liệu
            </>
          }
          exeIcon={
            <>
              <Check className="button-icon text-green-500" /> Đã reset
            </>
          }
          onClick={resetDataOnPage}
        />
      </div>
    </div>
  );
}
