import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { showToast } from "@/lib/toast";
import ProductFilterBar from "./ProductFilterBar";
import { useProductFilters } from "./hooks/useProductFilters";
import {
  Alert,
  Avatar,
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
import { useState } from "react";
import type { Product } from "../../shared/types/Product";
import PageHeader from "../common/PageHeader";
import ProductFormDialog from "./ProductsFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";

function Products() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const deleteProduct = useDeleteProduct();
  const qc = useQueryClient();

  const { filters, filteredProducts, activeFilterCount, updateFilter, clearFilters } =
    useProductFilters(products);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  function handleDeleteClick(product: Product) {
    setDeleting(product);
    setConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await deleteProduct.mutateAsync(deleting.id);
      showToast("Product deleted", "success");
    } catch {
      showToast("Delete failed", "error");
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Products"
        actionLabel="Add Product"
        onAction={handleAdd}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error).message}
        </Alert>
      )}

      {!isLoading && (
        <ProductFilterBar
          products={products}
          filters={filters}
          activeFilterCount={activeFilterCount}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 64 }}>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Avatar
                      variant="square"
                      src={product.imageUrl}
                      alt={product.name}
                      sx={{ width: 48, height: 48 }}
                    >
                      <BrokenImageIcon fontSize="small" />
                    </Avatar>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    {product.price.toLocaleString("ro-RO", {
                      style: "currency",
                      currency: "RON",
                    })}
                  </TableCell>
                  <TableCell>
                    {product.categories.join(", ") || "—"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(product)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ border: "none" }}>
                    <EmptyState
                      icon={<InventoryIcon />}
                      title={products.length === 0 ? "No products yet" : "No results"}
                      description={products.length === 0 ? "Add your first product to get started." : "No products match the current filters."}
                      action={products.length === 0 ? { label: "Add Product", onClick: handleAdd } : undefined}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formOpen && (
        <ProductFormDialog
          product={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            void qc.invalidateQueries({ queryKey: queryKeys.products });
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete product"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Products;
