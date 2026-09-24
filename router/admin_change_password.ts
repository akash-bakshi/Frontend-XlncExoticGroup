// Backend API layer: the sessionless admin password reset.
import { ApiError, errorText, request, retryAfterOf, unreachable } from "./api";

interface ResetResult {
  status: string;
  username: string;
}

export async function reset(
  secret: string,
  username: string,
  newPassword: string,
  confirmPassword: string
): Promise<ResetResult> {
  let response: Response;
  try {
    response = await request("/api/admin_change_password", {
      method: "POST",
      body: {
        secret,
        username,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
    });
  } catch {
    unreachable();
  }

  if (!response.ok) {
    throw new ApiError(await errorText(response), response.status, retryAfterOf(response));
  }
  return response.json();
}
