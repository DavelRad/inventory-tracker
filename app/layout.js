// app/layout.js
"use client"
import { AuthProvider } from './authentication/authContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { poppins } from './fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <title>Inventory Management</title>
        <meta name="description" content="Inventory Management Application" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}