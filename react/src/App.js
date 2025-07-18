import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Load the latest saved value on component mount
  useEffect(() => {
    const fetchLatestValue = async () => {
      try {
        const response = await fetch('/api/getLatest', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            setInputValue(data.value);
            setResponseMessage('Latest value loaded');
            setIsError(false);
          } else {
            setResponseMessage('No saved value found');
            setIsError(false);
          }
        } else {
          const errorData = await response.json();
          setResponseMessage(errorData.error || 'Failed to load latest value');
          setIsError(true);
        }
      } catch (error) {
        setResponseMessage('Failed to connect to the server');
        setIsError(true);
      }
    };

    fetchLatestValue();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message);
        setIsError(false);
        setInputValue('');
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.error || 'Something went wrong');
        setIsError(true);
      }
    } catch (error) {
      setResponseMessage('Failed to connect to the server');
      setIsError(true);
    }
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Save Your Input
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <TextField
              label="Enter your text"
              variant="outlined"
              value={inputValue}
              onChange={handleInputChange}
              fullWidth
              sx={{ maxWidth: 400 }}
            />
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!inputValue.trim()}
              sx={{
                width: 200,
                padding: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Save
            </Button>
          </Box>
          {responseMessage && (
            <Typography
              variant="body1"
              sx={{ mt: 2, color: isError ? 'error.main' : 'success.main' }}
            >
              {responseMessage}
            </Typography>
          )}
        </Paper>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
