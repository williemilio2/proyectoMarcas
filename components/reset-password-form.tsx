// components/reset-password-form.tsx

"use client";

import { useActionState } from "react";
import { updatePassword } from "@/src/actions/reset-password";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm({
  token,
}: {
  token: string;
}) {
  const [state, formAction] = useActionState(
    updatePassword,
    { error: "" }
  );

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="hidden"
        name="token"
        value={token}
      />

      <Input
        name="password"
        type="password"
        placeholder="Nueva contraseña"
        minLength={6}
        required
      />

      <Button
        type="submit"
        className="w-full cursor-pointer"
      >
        Cambiar contraseña
      </Button>

      {state.error && (
        <p className="text-center text-sm font-medium text-red-500">
          {state.error}
        </p>
      )}
    </form>
  );
}