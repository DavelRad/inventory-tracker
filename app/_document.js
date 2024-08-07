// app/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { poppins } from './fonts'; // Adjust the path if necessary

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en" className={poppins.className}>
        <Head>
          {/* Add any other head tags here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
