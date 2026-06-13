import Link from "next/link";
import { db } from "@/src/lib/db";
import { KeyRound , XCircle } from "lucide-react";
import ResetPasswordForm from '@/components/reset-password-form'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto size-14 text-red-500" />
            <CardTitle>Token inválido</CardTitle>
            <CardDescription>
              El enlace de verificación no es válido.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">
                Ir a iniciar sesión
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

const result = await db.execute({
  sql: `
    SELECT id_usuario
    FROM usuarios_reset_password
    WHERE reset_token = ?
      AND expires_at > CURRENT_TIMESTAMP
  `,
  args: [token],
});

  if (!result.rows[0]) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto size-14 text-red-500" />
            <CardTitle>Enlace expirado</CardTitle>
            <CardDescription>
              El enlace de verificación ya no es válido o ha expirado.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">
                Ir a iniciar sesión
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-blue-200">
        <CardHeader className="text-center">
          <KeyRound  className="mx-auto size-16 text-blue-500" />

          <CardTitle className="text-2xl">
            Restablecer contraseña
          </CardTitle>

          <CardDescription>
            Introduce una nueva contraseña para tu cuenta.
            Una vez guardada podrás iniciar sesión con ella.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-800">
              Por seguridad, la contraseña debe tener al menos 6 caracteres.
            </p>
          </div>

          <ResetPasswordForm token={token} />
        </CardContent>

        <CardFooter>
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href="/login">
              Volver al inicio de sesión
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}