import { categoriesApi } from "@/api/client/CategoryApiClient";
import type { Category } from "@/shared/types/Category";
import { showToast } from "@/lib/toast";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";

interface CategoryFormDialogProps {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryFormDialog({
  category,
  onClose,
  onSaved,
}: CategoryFormDialogProps) {
  const isEditing = category !== null;

  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = { name, description };
      if (isEditing) {
        await categoriesApi.update(category.id, data);
      } else {
        await categoriesApi.create(data);
      }
      showToast(isEditing ? "Category updated" : "Category created", "success");
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryFormDialog;
