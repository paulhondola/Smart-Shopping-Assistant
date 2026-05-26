import { Box, Typography, Button } from "@mui/material";

interface PageHeaderProps {
  title: string;
  actionLabel: string;
  onAction: () => void;
}

function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  return (
    <Box>
      <Typography>{title}</Typography>
      <Button onClick={onAction}>{actionLabel}</Button>
    </Box>
  );
}

export default PageHeader;
