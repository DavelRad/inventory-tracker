// app/layout.js
"use client";

import { AuthProvider } from './authentication/authContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import theme from './theme';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Inventory Management</title>
        <meta name="description" content="Inventory Management Application" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
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