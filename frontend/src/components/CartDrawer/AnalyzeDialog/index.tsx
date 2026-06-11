import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Analysis, Suggestion } from "@/shared/types/Analysis";
import { cartApi } from "@/api/client/CartApiClient";
import { useCart } from "@/context/CartContext/cart-context";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface AnalyzeDialogProps {
  onClose: () => void;
}

const loadingMessages = [
  "🤖 Reading your cart...",
  "🔍 Checking promotions...",
  "✨ Finding the best deals...",
  "🛒 Composing suggestions...",
];

type Decision = "approved" | "declined";

function AnalyzeDialog({ onClose }: AnalyzeDialogProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  const { addItem } = useCart();

  useEffect(() => {
    cartApi
      .analyze()
      .then((data) => {
        setAnalysis(data);
        setError("");
      })
      .catch((err) => {
        setError((err as Error).message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setProgress((current) => (current >= 90 ? 90 : current + 5));
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  async function handleApprove(suggestion: Suggestion) {
    await addItem(suggestion.productId, suggestion.quantity);
    setDecisions((current) => ({
      ...current,
      [suggestion.productId]: "approved",
    }));
  }

  function handleDecline(suggestion: Suggestion) {
    setDecisions((current) => ({
      ...current,
      [suggestion.productId]: "declined",
    }));
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AutoAwesomeIcon color="primary" />
        AI Cart Analysis
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box sx={{ py: 4, px: 2 }}>
            <Typography sx={{ mb: 2 }}>
              {loadingMessages[messageIndex]}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}{" "}
        {error !== "" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {analysis !== null && !loading && (
          <Stack spacing={2}>
            <Typography>{analysis.summary}</Typography>
            <Divider />

            {analysis.suggestions.length === 0 && (
              <Typography color="text.secondary">
                No suggestions for this cart.
              </Typography>
            )}

            {analysis.suggestions.map((suggestion) => {
              const decision = decisions[suggestion.productId];
              return (
                <Box
                  key={suggestion.productId}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">
                      {suggestion.name} x {suggestion.quantity}
                    </Typography>
                    <Typography variant="subtitle1">
                      {suggestion.priceLabel}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {suggestion.reason}
                  </Typography>
                  {suggestion.savingsLabel !== null && (
                    <Typography
                      variant="body2"
                      color="success"
                      sx={{ mt: 0.5 }}
                    >
                      Saves {suggestion.savingsLabel}
                    </Typography>
                  )}

                  <Box sx={{ mt: 1.5 }}>
                    {decision === undefined ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CheckIcon />}
                          onClick={() => handleApprove(suggestion)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="inherit"
                          startIcon={<CloseIcon />}
                          onClick={() => handleDecline(suggestion)}
                        >
                          Decline
                        </Button>
                      </Stack>
                    ) : (
                      <Box />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AnalyzeDialog;
