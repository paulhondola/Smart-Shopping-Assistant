import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useAuth } from "@/context/AuthContext/auth-context";
import { showToast } from "@/lib/toast";

function Profile() {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadAvatar(file);
      showToast("Avatar updated", "success");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
      // Reset so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
          <Box sx={{ position: "relative", width: 80, height: 80, mb: 2 }}>
            <Avatar
              src={user?.avatarUrl}
              sx={{
                width: 80,
                height: 80,
                fontSize: 32,
                bgcolor: "primary.main",
              }}
            >
              {user?.displayName?.charAt(0).toUpperCase()}
            </Avatar>
            <Tooltip title="Change photo">
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                aria-label="Upload avatar"
                sx={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  bgcolor: "background.paper",
                  border: "2px solid",
                  borderColor: "divider",
                  p: 0.5,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                {uploading ? (
                  <CircularProgress size={14} />
                ) : (
                  <CameraAltIcon sx={{ fontSize: 14 }} />
                )}
              </IconButton>
            </Tooltip>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </Box>
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
