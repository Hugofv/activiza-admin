/**
 * Modules List Page
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import ComponentCard from '@/components/common/ComponentCard';
import PageMeta from '@/components/common/PageMeta';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import { modulesService, Module } from '@/lib/api/services/modulesService';
import { toast } from '@/lib/toast';
import { PencilIcon, TrashBinIcon, PlusIcon } from '@/icons';
import ConfirmDialog from '@/components/ui/confirmDialog/ConfirmDialog';

export default function ModulesList() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    moduleId: number | null;
    moduleName: string | null;
  }>({
    isOpen: false,
    moduleId: null,
    moduleName: null,
  });

  const fetchModules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await modulesService.getAll({
        page,
        limit: 20,
        q: searchQuery || undefined,
      });
      setModules(response.results);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar módulos';
      setError(errorMessage);
      toast.error('Erro ao carregar módulos', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteDialog({
      isOpen: true,
      moduleId: id,
      moduleName: name,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.moduleId) return;

    try {
      await modulesService.delete(deleteDialog.moduleId);
      toast.success('Módulo excluído com sucesso!');
      setDeleteDialog({ isOpen: false, moduleId: null, moduleName: null });
      fetchModules();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir módulo';
      toast.error('Erro ao excluir módulo', errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, moduleId: null, moduleName: null });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge color="success" variant="light" size="sm">
        Ativo
      </Badge>
    ) : (
      <Badge color="error" variant="light" size="sm">
        Inativo
      </Badge>
    );
  };

  return (
    <>
      <PageMeta
        title="Módulos | Ativiza"
        description="Gerenciamento de módulos"
      />
      <div className="space-y-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Módulos</h2>
          <Link
            to="/modules/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Novo Módulo
          </Link>
        </div>

        <ComponentCard title="Lista de Módulos">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar módulos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          ) : modules?.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              Nenhum módulo encontrado
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
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
                        Código
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Descrição
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Traduções
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
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {module.name}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800">
                            {module.key}
                          </code>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {module.description || '-'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {module.meta?.translations ? (
                            <div className="flex flex-col gap-1">
                              {Object.entries(module.meta.translations).map(([locale, value]) => (
                                <span key={locale} className="text-xs">
                                  <span className="font-medium">{locale}:</span> {value}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm">
                          {getStatusBadge(module.isActive)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/modules/${module.id}/edit`}
                              className="p-2 text-gray-600 transition-colors rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                            >
                              <PencilIcon className="size-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(module.id, module.name)}
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

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Módulo"
        message="Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita."
        itemName={deleteDialog.moduleName || undefined}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}

