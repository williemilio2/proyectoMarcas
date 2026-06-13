// login-form.tsx

"use client";

import { useSearchParams } from "next/navigation";

export default function LoginMessage() {
  const searchParams = useSearchParams();

  const reset = searchParams.get("reset");

  if (reset !== "success") return null;

  return (
    <p className="bg-green-200 border-l-4 border-green-600 text-green-900 px-4 py-3 rounded italic font-semibold shadow-sm">
      Contraseña cambiada correctamente ✅
    </p>
  );
}