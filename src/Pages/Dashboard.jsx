import { useEffect, useState } from 'react';
import api from '../Services/api';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/api/auth/profile');
        if (mounted) setProfile(res.data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load profile');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      
    </Box>
  );
}
