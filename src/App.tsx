import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  CssBaseline,
  Container,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
};

type AutoCompleteOption = {
  id: number;
  formattedName: string;
  address: {
    street: string;
    suite: string;
    zipcode: string;
  };
};

// for sorting our users
const extractLastName = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1].toLowerCase();
};

const formatName = (name: string): string => {
  const parts = name.trim().split(/\s+/);

  let prefix = '';
  let suffix = '';

  if (/^(Mr\.|Mrs\.|Ms\.|Dr\.)$/i.test(parts[0])) {
    prefix = parts.shift()!;
  }

  if (/^(Jr\.|Sr\.|III|IV)$/i.test(parts[parts.length - 1])) {
    suffix = parts.pop()!;
  }

  const firstName = parts[0] || '';
  const lastName = parts[parts.length - 1] || '';

  const base = `${lastName}, ${firstName}`;
  const tag = [prefix, suffix].filter(Boolean).join('/');
  return tag ? `${base} (${tag})` : base;
};

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          background: '#e0e0e0',
          boxShadow: '7px 7px 15px #bebebe, -7px -7px 15px #ffffff',
          padding: '4px 8px',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [selected, setSelected] = useState<AutoCompleteOption | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data: User[] = await res.json();

      const formatted = data
        .sort((a, b) => extractLastName(a.name).localeCompare(extractLastName(b.name)))
        .map((user) => ({
          id: user.id,
          formattedName: formatName(user.name),
          address: {
            street: user.address.street,
            suite: user.address.suite,
            zipcode: user.address.zipcode,
          },
        }));

      setOptions(formatted);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: '20px',
            background: '#e0e0e0',
            boxShadow: '10px 10px 30px #bebebe, -10px -10px 30px #ffffff',
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Autocomplete
              fullWidth
              options={options}
              getOptionLabel={(option) => option.formattedName}
              onChange={(_, value) => setSelected(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select User" variant="outlined" />
              )}
            />
          )}

          {selected && (
            <Box sx={{ mt: 4, p: 2, borderRadius: '16px', background: '#e0e0e0', boxShadow: 'inset 4px 4px 10px #bebebe, inset -4px -4px 10px #ffffff' }}>
              <Typography variant="h6">{selected.formattedName}</Typography>
              <Typography variant="body2">
                {selected.address.street}
              </Typography>
              <Typography variant="body2">
                {selected.address.suite}
              </Typography>
              <Typography variant="body2">
                {selected.address.zipcode}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
