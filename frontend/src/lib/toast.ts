import { enqueueSnackbar } from "notistack";

export function showToast(
  message: string,
  variant: "success" | "error" | "info" | "warning" = "info",
): void {
  enqueueSnackbar(message, { variant });
}
