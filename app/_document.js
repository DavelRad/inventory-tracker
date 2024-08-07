// app/_document.js
import { Html, Head, Main, NextScript } from 'next/document';
import { poppins } from './fonts'; // Adjust the path if necessary

export default function Document() {
  return (
    <Html lang="en" className={poppins.className}>
      <Head>
        {/* Other head tags */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
