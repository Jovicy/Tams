import toast from "react-hot-toast";

type ResponseLike = {
  status?: boolean;
  message?: string;
};

export function notifyResponse(response: ResponseLike, fallbackMessage = "Request completed.") {
  const message = response.message?.trim() || fallbackMessage;

  if (response.status === false) {
    toast.error(message);
    return;
  }

  toast.success(message);
}

export function notifySuccess(message: string) {
  toast.success(message);
}

export function notifyError(error: unknown, fallbackMessage = "Something went wrong.") {
  const message = error instanceof Error ? error.message : fallbackMessage;
  toast.error(message);
}
