import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext/auth-context";
import { showToast } from "@/lib/toast";

function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: 32,
              bgcolor: "primary.main",
              mb: 2,
            }}
          >
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Chip
            label={user?.role}
            color={user?.role === "Admin" ? "error" : "default"}
            size="small"
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!editing || saving}
            fullWidth
          />
          <TextField
            label="Email"
            value={user?.email ?? ""}
            disabled
            fullWidth
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
          {editing ? (
            <>
              <Button
                onClick={() => {
                  setDisplayName(user?.displayName ?? "");
                  setEditing(false);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={saving || displayName.trim() === ""}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await updateProfile(displayName.trim());
                    showToast("Profile updated", "success");
                    setEditing(false);
                  } catch {
                    showToast("Update failed", "error");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button variant="outlined" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
