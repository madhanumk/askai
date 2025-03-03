import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Script from 'next/script';
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  useEffect(() => {
    // Add classes to body when component mounts
    document.body.classList.add("g-sidenav-show", "bg-gray-100");

    // Cleanup function to remove classes when component unmounts
    return () => {
      document.body.classList.remove("g-sidenav-show", "bg-gray-100");
    };
  }, []);
  const router = useRouter();
  // Hide header for the register page
  const hideHeaderRoutes = ["/registration","/login"];


  return (
    <div>
      {!hideHeaderRoutes.includes(router.pathname) && <Header /> }
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        {children}
      </main>
      <Footer />

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
