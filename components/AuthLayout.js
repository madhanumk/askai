import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Script from 'next/script';

const Layout = ({ children }) => {


  return (
    <div>
     
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        {children}
      </main>
  

      {/* Load Scripts */}
      <Script src="/static/popper.min.js" strategy="beforeInteractive" />
      <Script src="/static/bootstrap.min.js" strategy="beforeInteractive" />
      <Script src="/static/perfect-scrollbar.min.js" strategy="lazyOnload" />
      <Script src="/static/smooth-scrollbar.min.js" strategy="lazyOnload" />
      <Script src="/static/chartjs.min.js" strategy="lazyOnload" />
    </div>
  );
};

export default Layout;
