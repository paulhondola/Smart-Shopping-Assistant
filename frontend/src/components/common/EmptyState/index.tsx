import { Box, Button, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
      <Box sx={{ mb: 2, color: "text.disabled", "& svg": { fontSize: 56 } }}>
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 3 : 0 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button variant="outlined" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
