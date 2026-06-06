import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { categoriesApi } from "@/api/client/CategoryApiClient";
import {
  Alert,
  Box,
  CircularProgress,
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
import { useEffect, useState } from "react";
import type { Category } from "../../shared/types/Category";
import PageHeader from "../common/PageHeader";
import CategoryFormDialog from "./CategoryFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";
import CategoryFilterBar from "./CategoryFilterBar";
import { useCategoryFilters } from "./hooks/useCategoryFilters";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    filters,
    filteredCategories,
    activeFilterCount,
    updateFilter,
    clearFilters,
  } = useCategoryFilters(categories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadCategories() {
    categoriesApi
      .getAll()
      .then((data) => {
        setCategories(data);
        setError("");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }

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
      await categoriesApi.remove(deleting.id);
      loadCategories();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Categories"
        actionLabel="Add Category"
        onAction={handleAdd}
      />

      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && (
        <CategoryFilterBar
          filters={filters}
          activeFilterCount={activeFilterCount}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
              {filteredCategories.map((category) => (
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
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {categories.length === 0
                      ? "No categories yet."
                      : "No categories match the current filters."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formOpen && (
        <CategoryFormDialog
          category={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadCategories();
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
