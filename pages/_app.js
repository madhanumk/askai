import Layout from "../components/Layout";
// Ensure you have global styles
import "../styles/material-dashboard.css";
import "../styles/style.css";
import "../styles/nucleo-icons.css";
import "../styles/nucleo-svg.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
        <Head>
        {/* Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700,900"
        />
          <title>AI Ask & Summarize Agent</title>
          <link rel="icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
