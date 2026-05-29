"use client";

import { useState } from "react";
import { User, Shield, Crown, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ROLES } from "@/lib/constants";
import { cambiarRolUsuario } from "@/src/actions/cambiarRolUsuario";

interface Miembro {
  id: number;
  nombre: string;
  email: string;
  id_rol: number;
}

interface MiembrosDialogProps {
  children: React.ReactNode;
  miembros: Miembro[];
  grupoId: number;
  userRole: number | null;
  currentUserId: number;
  onMiembrosUpdated: () => void;
}

const ROLE_NAMES: Record<number, string> = {
  [ROLES.ALUMNO]: "Alumno",
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.DELEGADO]: "Delegado",
  [ROLES.PROFESOR]: "Profesor",
  [ROLES.CREADOR]: "Creador",
};

const ROLE_COLORS: Record<number, string> = {
  [ROLES.ALUMNO]: "bg-gray-500",
  [ROLES.ADMINISTRADOR]: "bg-blue-500",
  [ROLES.DELEGADO]: "bg-green-500",
  [ROLES.PROFESOR]: "bg-yellow-500",
  [ROLES.CREADOR]: "bg-purple-500",
};

export function MiembrosDialog({
  children,
  miembros,
  grupoId,
  userRole,
  currentUserId,
  onMiembrosUpdated,
}: MiembrosDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<number | null>(null);

  // Determinar si puede cambiar roles
  const canChangeRoles = userRole === ROLES.CREADOR || userRole === ROLES.ADMINISTRADOR;

  // Obtener los roles disponibles segun mi rol
  const getAvailableRoles = () => {
    if (userRole === ROLES.CREADOR) {
      // Creador puede dar cualquier rol menos Creador
      return [ROLES.ALUMNO, ROLES.DELEGADO, ROLES.PROFESOR, ROLES.ADMINISTRADOR];
    } else if (userRole === ROLES.ADMINISTRADOR) {
      // Admin puede dar cualquier rol menos Creador y Admin
      return [ROLES.ALUMNO, ROLES.DELEGADO, ROLES.PROFESOR];
    }
    return [];
  };

  // Verificar si puedo cambiar el rol de este usuario
  const canChangeUserRole = (miembro: Miembro) => {
    if (!canChangeRoles) return false;
    if (miembro.id === currentUserId) return false; // No puedo cambiarme a mi mismo
    if (miembro.id_rol === ROLES.CREADOR) return false; // Nadie puede cambiar al creador
    if (userRole === ROLES.ADMINISTRADOR && miembro.id_rol === ROLES.ADMINISTRADOR) {
      return false; // Admin no puede cambiar a otro admin
    }
    return true;
  };

  const handleRoleChange = async (miembroId: number, nuevoRol: string) => {
    setLoading(miembroId);
    try {
      const result = await cambiarRolUsuario(
        grupoId,
        miembroId,
        parseInt(nuevoRol, 10),
        currentUserId
      );
      if (result.success) {
        onMiembrosUpdated();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error al cambiar rol:", error);
    } finally {
      setLoading(null);
    }
  };

  const getRoleIcon = (rol: number) => {
    if (rol === ROLES.CREADOR) return <Crown className="size-4" />;
    if (rol === ROLES.ADMINISTRADOR) return <Shield className="size-4" />;
    return <User className="size-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersIcon className="size-5" />
            Miembros del Grupo
          </DialogTitle>
          <DialogDescription>
            {miembros.length} miembro{miembros.length !== 1 && "s"} en total
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                {canChangeRoles && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {miembros.map((miembro) => (
                <TableRow key={miembro.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(miembro.id_rol)}
                      {miembro.nombre}
                      {miembro.id === currentUserId && (
                        <Badge variant="outline" className="text-xs">
                          Tu
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {miembro.email}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${ROLE_COLORS[miembro.id_rol]} text-white`}>
                      {ROLE_NAMES[miembro.id_rol]}
                    </Badge>
                  </TableCell>
                  {canChangeRoles && (
                    <TableCell className="text-right">
                      {canChangeUserRole(miembro) ? (
                        <Select
                          defaultValue={miembro.id_rol.toString()}
                          onValueChange={(value) => handleRoleChange(miembro.id, value)}
                          disabled={loading === miembro.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableRoles().map((rol) => (
                              <SelectItem key={rol} value={rol.toString()}>
                                {ROLE_NAMES[rol]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}