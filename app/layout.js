"use client"; // Add this line to indicate a client component

import { AuthProvider } from './authentication/authContext';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Inventory Management</title>
        <meta name="description" content="Inventory Management Application" />
      </Head>
      <body>
        <AuthProvider>
          <CssBaseline />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
