/**
 * Features List Page
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
import { featuresService, Feature } from '@/lib/api/services/featuresService';
import { modulesService, Module } from '@/lib/api/services/modulesService';
import { toast } from '@/lib/toast';
import { PencilIcon, TrashBinIcon, PlusIcon } from '@/icons';
import ConfirmDialog from '@/components/ui/confirmDialog/ConfirmDialog';

export default function FeaturesList() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    featureId: number | null;
    featureName: string | null;
  }>({
    isOpen: false,
    featureId: null,
    featureName: null,
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await modulesService.getAll({ limit: 1000 });
        setModules(response.results);
      } catch {
        // Silently fail
      }
    };
    fetchModules();
  }, []);

  const fetchFeatures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await featuresService.getAll({
        page,
        limit: 20,
        q: searchQuery || undefined,
      });
      setFeatures(response.results);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar features';
      setError(errorMessage);
      toast.error('Erro ao carregar features', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteDialog({
      isOpen: true,
      featureId: id,
      featureName: name,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.featureId) return;

    try {
      await featuresService.delete(deleteDialog.featureId);
      toast.success('Feature excluída com sucesso!');
      setDeleteDialog({ isOpen: false, featureId: null, featureName: null });
      fetchFeatures();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir feature';
      toast.error('Erro ao excluir feature', errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, featureId: null, featureName: null });
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
        title="Funcionalidades | Ativiza"
        description="Gerenciamento de funcionalidades"
      />
      <div className="space-y-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Features</h2>
          <Link
            to="/features/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Nova Funcionalidade
          </Link>
        </div>

        <ComponentCard title="Lista de Funcionalidades">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar funcionalidades..."
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
          ) : features.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              Nenhuma funcionalidade encontrada
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
                        Chave
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
                        Categoria
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Módulo
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
                    {features.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {feature.name}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800">
                            {feature.key}
                          </code>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {feature.description || '-'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {feature.category || <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                          {feature.module ? (
                            feature.module.name
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm">
                          {getStatusBadge(feature.isActive)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/features/${feature.id}/edit`}
                              className="p-2 text-gray-600 transition-colors rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                            >
                              <PencilIcon className="size-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(feature.id, feature.name)}
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
        title="Excluir Feature"
        message="Tem certeza que deseja excluir esta feature? Esta ação não pode ser desfeita."
        itemName={deleteDialog.featureName || undefined}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}

