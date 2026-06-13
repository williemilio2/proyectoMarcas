"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { useUser } from "@/contexts/user-context";
import { obtenerGruposDisponibles } from "@/src/actions/obtenerGruposDisponibles";
import { unirseGrupo } from "@/src/actions/unirseGrupo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}

export default function BuscarGruposPage() {
  const router = useRouter();
  const { user } = useUser();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [filteredGrupos, setFilteredGrupos] = useState<Grupo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [joiningGroup, setJoiningGroup] = useState<number | null>(null);

  useEffect(() => {
    async function cargarGrupos() {
      if (!user?.id) return;

      const gruposDisponibles = await obtenerGruposDisponibles(user.id);
      const gruposFormateados = gruposDisponibles.map((g) => ({
        id: g.id as number,
        nombre: g.nombre as string,
        descripcion: g.descripcion as string,
        color: g.color as string,
      }));
      setGrupos(gruposFormateados);
      setFilteredGrupos(gruposFormateados);
      setLoading(false);
    }

    cargarGrupos();
  }, [user?.id]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGrupos(grupos);
    } else {
      const filtered = grupos.filter(
        (grupo) =>
          grupo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grupo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGrupos(filtered);
    }
  }, [searchTerm, grupos]);

  async function handleUnirse(idGrupo: number) {
    if (!user?.id) return;

    setJoiningGroup(idGrupo);
    const result = await unirseGrupo(user.id, idGrupo);

    if (result.success) {
      router.push("/");
      /*
      setGrupos((prev) => prev.filter((g) => g.id !== idGrupo));
      setFilteredGrupos((prev) => prev.filter((g) => g.id !== idGrupo));*/
    } else {
      alert(result.message);
    }

    setJoiningGroup(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando grupos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Buscar Grupos</h1>
            <p className="text-muted-foreground">
              Encuentra y únete a nuevos grupos
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar grupos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results */}
        {filteredGrupos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="size-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay grupos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? "No se encontraron grupos con esa búsqueda"
                  : "Ya eres miembro de todos los grupos existentes"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredGrupos.map((grupo) => (
              <Card
                key={grupo.id}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: grupo.color || "#6366f1" }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: grupo.color || "#6366f1" }}
                    />
                    {grupo.nombre}
                  </CardTitle>
                  <CardDescription>
                    {grupo.descripcion || "Sin descripción"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleUnirse(grupo.id)}
                    disabled={joiningGroup === grupo.id}
                    className="w-full cursor-pointer"
                  >
                    {joiningGroup === grupo.id ? "Uniéndose..." : "Unirse al grupo"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Counter */}
        <p className="text-center text-sm text-muted-foreground">
          {filteredGrupos.length} grupo{filteredGrupos.length !== 1 ? "s" : ""}{" "}
          disponible{filteredGrupos.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
