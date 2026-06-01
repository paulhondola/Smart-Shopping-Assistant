import { categoriesApi } from "@/api/client/CategoryApiClient";
import { productsApi } from "@/api/client/ProductApiClient";
import type { ProductCreateDto, ProductUpdateDto } from "@/api/models/ProductModel";
import type { Category } from "@/shared/types/Category";
import type { Product } from "@/shared/types/Product";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";

interface ProductFormDialogProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

function ProductFormDialog({ product, onClose, onSaved }: ProductFormDialogProps) {
  const isEditing = product !== null;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [price, setPrice] = useState(product?.price.toString() ?? "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await categoriesApi.getAll();
        setAllCategories(cats);
        if (isEditing && product.categories.length > 0) {
          const preSelected = cats
            .filter((c) => product.categories.includes(c.name))
            .map((c) => c.id);
          setSelectedCategoryIds(preSelected);
        }
      } catch {
        // non-blocking — categories will just be empty
      }
    }
    void loadCategories();
  }, [isEditing, product]);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        const data: ProductUpdateDto = {
          name,
          description,
          imageUrl,
          price: parsedPrice,
          categoryIds: selectedCategoryIds,
        };
        await productsApi.update(product.id, data);
      } else {
        const data: ProductCreateDto = {
          name,
          description,
          imageUrl,
          price: parsedPrice,
          categoryIds: selectedCategoryIds,
        };
        await productsApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== "" && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            type="number"
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          />
          <FormControl fullWidth>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={selectedCategoryIds}
              onChange={(e) =>
                setSelectedCategoryIds(e.target.value as number[])
              }
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) =>
                allCategories
                  .filter((c) => (selected as number[]).includes(c.id))
                  .map((c) => c.name)
                  .join(", ")
              }
            >
              {allCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Checkbox checked={selectedCategoryIds.includes(cat.id)} />
                  <ListItemText primary={cat.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductFormDialog;
