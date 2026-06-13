import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { showToast } from "@/lib/toast";
import {
  Alert,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { TableRowSkeleton } from "@/components/common/TableRowSkeleton";
import { useState } from "react";
import type { Category } from "@/shared/types/Category";
import PageHeader from "@/components/common/PageHeader";
import CategoryFormDialog from "@/components/Categories/CategoryFormDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CategoryFilterBar from "@/components/Categories/CategoryFilterBar";
import { useCategoryFilters } from "./hooks/useCategoryFilters";
import EmptyState from "@/components/common/EmptyState";

function Categories() {
  const { data: categories = [], isLoading, isError, error } = useCategories();
  const deleteCategory = useDeleteCategory();
  const qc = useQueryClient();

  const {
    filters,
    filteredCategories,
    activeFilterCount,
    updateFilter,
    clearFilters,
  } = useCategoryFilters(categories);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  function handleDeleteClick(category: Category) {
    setDeleting(category);
    setConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await deleteCategory.mutateAsync(deleting.id);
      showToast("Category deleted", "success");
    } catch {
      showToast("Delete failed", "error");
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Categories"
        actionLabel="Add Category"
        onAction={handleAdd}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error).message}
        </Alert>
      )}

      {!isLoading && (
        <CategoryFilterBar
          filters={filters}
          activeFilterCount={activeFilterCount}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} columns={3} />)
              : filteredCategories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(category)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ border: "none" }}>
                    <EmptyState
                      icon={<CategoryIcon />}
                      title={categories.length === 0 ? "No categories yet" : "No results"}
                      description={categories.length === 0 ? "Add your first category to get started." : "No categories match the current filters."}
                      action={categories.length === 0 ? { label: "Add Category", onClick: handleAdd } : undefined}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      {formOpen && (
        <CategoryFormDialog
          category={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            void qc.invalidateQueries({ queryKey: queryKeys.categories });
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete category"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Categories;
