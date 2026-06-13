import Link from "next/link";
import { db } from "@/src/lib/db";
import { CheckCircle, XCircle } from "lucide-react";

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
      FROM usuarios_verificacion
      WHERE verification_token = ?
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

  await db.execute({
    sql: `
      UPDATE usuarios_verificacion
      SET verificado = 1,
          verification_token = ''
      WHERE verification_token = ?
    `,
    args: [token],
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-green-200">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto size-16 text-green-500" />

          <CardTitle className="text-2xl">
            ¡Cuenta verificada!
          </CardTitle>

          <CardDescription>
            Tu cuenta ha sido verificada correctamente.
            Ya puedes iniciar sesión y acceder a todas las funcionalidades.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
            <p className="text-sm text-green-800">
              Verificación completada con éxito ✅
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">
              Iniciar sesión
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}