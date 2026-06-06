import { categoriesApi } from "@/api/client/CategoryApiClient";
import { productsApi } from "@/api/client/ProductApiClient";
import { promotionsApi } from "@/api/client/PromotionsApiClient";
import type {
  PromotionCreateDto,
  PromotionUpdateDto,
} from "@/api/models/PromotionsModel";
import { PromotionReward, PromotionType } from "@/api/models/PromotionsModel";
import type { Category } from "@/shared/types/Category";
import type { Product } from "@/shared/types/Product";
import type { Promotion } from "@/shared/types/Promotion";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";

interface PromotionFormDialogProps {
  promotion: Promotion | null;
  onClose: () => void;
  onSaved: () => void;
}

function PromotionFormDialog({
  promotion,
  onClose,
  onSaved,
}: PromotionFormDialogProps) {
  const isEditing = promotion !== null;

  const [name, setName] = useState(promotion?.name ?? "");
  const [type, setType] = useState<number>(
    promotion?.type ?? PromotionType.Quantity,
  );
  const [threshold, setThreshold] = useState(
    promotion?.threshold.toString() ?? "0",
  );
  const [reward, setReward] = useState<number>(
    promotion?.reward ?? PromotionReward.FreeItems,
  );
  const [rewardValue, setRewardValue] = useState(
    promotion?.rewardValue.toString() ?? "0",
  );
  const [categoryId, setCategoryId] = useState<string>(
    promotion?.categoryId?.toString() ?? "",
  );
  const [productId, setProductId] = useState<string>(
    promotion?.productId?.toString() ?? "",
  );
  const [isActive, setIsActive] = useState(promotion?.isActive ?? true);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadRelated() {
      try {
        const [cats, prods] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll(),
        ]);
        setAllCategories(cats);
        setAllProducts(prods);
      } catch {
        // non-blocking
      }
    }
    void loadRelated();
  }, []);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    const parsedThreshold = parseFloat(threshold);
    const parsedRewardValue = parseInt(rewardValue, 10);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setError("Threshold must be a valid non-negative number.");
      return;
    }
    if (isNaN(parsedRewardValue) || parsedRewardValue <= 0) {
      setError("Reward value must be a positive integer.");
      return;
    }

    setSaving(true);
    setError("");

    const payload: PromotionCreateDto | PromotionUpdateDto = {
      name,
      type: type as PromotionType,
      threshold: parsedThreshold,
      reward: reward as PromotionReward,
      rewardValue: parsedRewardValue,
      categoryId: categoryId !== "" ? parseInt(categoryId, 10) : undefined,
      productId: productId !== "" ? parseInt(productId, 10) : undefined,
      isActive,
    };

    try {
      if (isEditing) {
        await promotionsApi.update(promotion.id, payload);
      } else {
        await promotionsApi.create(payload);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Promotion" : "Add Promotion"}
      </DialogTitle>
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
            select
            label="Type"
            value={type}
            onChange={(e) => setType(Number(e.target.value))}
            fullWidth
          >
            <MenuItem value={PromotionType.Quantity}>Quantity</MenuItem>
            <MenuItem value={PromotionType.CartTotal}>Cart Total</MenuItem>
          </TextField>

          <TextField
            label="Threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            fullWidth
            type="number"
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          />

          <TextField
            select
            label="Reward"
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            fullWidth
          >
            <MenuItem value={PromotionReward.FreeItems}>Free Items</MenuItem>
            <MenuItem value={PromotionReward.PercentDiscount}>
              % Discount
            </MenuItem>
          </TextField>

          <TextField
            label="Reward Value"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
            fullWidth
            type="number"
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />

          <TextField
            select
            label="Applies to Category (optional)"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">— None —</MenuItem>
            {allCategories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Applies to Product (optional)"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">— None —</MenuItem>
            {allProducts.map((prod) => (
              <MenuItem key={prod.id} value={prod.id.toString()}>
                {prod.name}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active"
          />
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

export default PromotionFormDialog;
