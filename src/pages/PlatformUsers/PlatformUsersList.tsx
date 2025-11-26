/**
 * Platform Users List Page
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import PageMeta from '../../components/common/PageMeta';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';
import { platformUsersService, PlatformUser } from '../../lib/api/services/platformUsersService';
import { PencilIcon, TrashBinIcon, PlusIcon } from '../../icons';

export default function PlatformUsersList() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await platformUsersService.getAll({
        page,
        limit: 20,
        q: searchQuery || undefined,
      });
      setUsers(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    try {
      await platformUsersService.delete(id);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir usuário');
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, 'primary' | 'success' | 'warning' | 'info'> = {
      owner: 'primary',
      admin: 'success',
      agent: 'warning',
      viewer: 'info',
    };
    const labels: Record<string, string> = {
      owner: 'Proprietário',
      admin: 'Administrador',
      agent: 'Agente',
      viewer: 'Visualizador',
    };
    return (
      <Badge color={colors[role] || 'info'} variant="light" size="sm">
        {labels[role] || role}
      </Badge>
    );
  };

  return (
    <>
      <PageMeta
        title="Usuários da Plataforma | Ativiza"
        description="Gerenciamento de usuários da plataforma"
      />
      <PageBreadcrumb pageTitle="Usuários da Plataforma" />
      <div className="space-y-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Usuários da Plataforma</h2>
          <Link
            to="/platform-users/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Novo Usuário
          </Link>
        </div>
        <ComponentCard title="Lista de Usuários">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full max-w-md px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Carregando...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-gray-500">Nenhum usuário encontrado</div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Nome
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Email
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Perfil
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Status
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Ações
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                            {user.name}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm">
                            {getRoleBadge(user.role)}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm">
                            {user.isActive ? (
                              <Badge color="success" variant="light" size="sm">
                                Ativo
                              </Badge>
                            ) : (
                              <Badge color="error" variant="light" size="sm">
                                Inativo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/platform-users/${user.id}/edit`}
                                className="p-2 text-gray-600 transition-colors rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                              >
                                <PencilIcon className="size-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-red-600 transition-colors rounded hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <TrashBinIcon className="size-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </ComponentCard>
      </div>
    </>
  );
}

