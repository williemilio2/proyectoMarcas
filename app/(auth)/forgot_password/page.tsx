import Link from "next/link";
import { Mail } from "lucide-react";

import { sendResetLink } from "@/src/actions/forgotPassword";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="mx-auto size-16 text-blue-500" />

          <CardTitle className="text-2xl">
            Restablecer contraseña
          </CardTitle>

          <CardDescription>
            Introduce el correo electrónico asociado a tu cuenta
            y te enviaremos un enlace para crear una nueva contraseña.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={sendResetLink} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
            >
              Enviar enlace
            </Button>
          </form>
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
                  {sent === "true" ? (
                <p className="bg-green-200 border-l-4 border-green-600 text-green-900 px-4 py-3 rounded italic font-semibold shadow-sm">
                  Te hemos enviado un correo con las instrucciones para
                  restablecer tu contraseña. Revisa también la carpeta de spam.
                </p>
            ) : <p></p>}
      </Card>
    </div>
  );
}