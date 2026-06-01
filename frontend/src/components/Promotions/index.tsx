import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { promotionsApi } from "@/api/client/PromotionsApiClient";
import {
  Alert,
  Box,
  Chip,
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
import type { Promotion } from "../../shared/types/Promotion";
import { promotionTypeLabel, promotionRewardLabel } from "../../shared/types/Promotion";
import PageHeader from "../common/PageHeader";
import PromotionFormDialog from "./PromotionFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";

function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState<Promotion | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function loadPromotions() {
    try {
      const data = await promotionsApi.getAll();
      setPromotions(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(promotion: Promotion) {
    setEditing(promotion);
    setFormOpen(true);
  }

  function handleDeleteClick(promotion: Promotion) {
    setDeleting(promotion);
    setConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await promotionsApi.remove(deleting.id);
      await loadPromotions();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    void loadPromotions();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Promotions"
        actionLabel="Add Promotion"
        onAction={handleAdd}
      />

      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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
                <TableCell>Type</TableCell>
                <TableCell>Threshold</TableCell>
                <TableCell>Reward</TableCell>
                <TableCell>Reward Value</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id} hover>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotionTypeLabel[promotion.type]}</TableCell>
                  <TableCell>{promotion.threshold}</TableCell>
                  <TableCell>{promotionRewardLabel[promotion.reward]}</TableCell>
                  <TableCell>{promotion.rewardValue}</TableCell>
                  <TableCell>
                    <Chip
                      label={promotion.isActive ? "Active" : "Inactive"}
                      color={promotion.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(promotion)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(promotion)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No promotions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formOpen && (
        <PromotionFormDialog
          promotion={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            void loadPromotions();
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete promotion"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Promotions;
