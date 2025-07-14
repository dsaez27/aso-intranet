'use client'

import { useUsers } from "@/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserManagementPage as UserManagementPageComponent } from "@/components/users/user-management-page";

export default function UsersPage() {
    const { loading } = useUsers();

    return (
        <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Gestión de Usuarios</CardTitle>
                <CardDescription>
                    Agrega, edita o elimina usuarios del sistema.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                {loading ? (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <Skeleton className="h-10 w-full sm:w-64" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-36" />
                            </div>
                        </div>
                        <div className="w-full overflow-x-auto rounded-lg border">
                            <Skeleton className="h-80 w-full" />
                        </div>
                    </div>
                ) : <UserManagementPageComponent />}
            </CardContent>
        </Card>
    );
}
