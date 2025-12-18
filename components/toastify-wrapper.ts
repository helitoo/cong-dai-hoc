import { Slide, toast } from "react-toastify";

export default function showToast({
  type = "info",
  message = "",
  duration = 3000,
}: {
  type?: "error" | "warn" | "success" | "info";
  message?: string;
  duration?: number;
}) {
  toast[type](message, {
    position: "top-center",
    transition: Slide,
    autoClose: duration,
  });
}
