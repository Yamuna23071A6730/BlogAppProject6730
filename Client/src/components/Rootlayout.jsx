import React from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function RootLayout() {
  if (!PUBLISHABLE_KEY) {
    console.warn("Clerk Publishable Key is missing. Ensure it is set in your environment variables.");
    return (
      <div>
        <Header />
        <div style={{ minHeight: "90vh", textAlign: "center", padding: "2rem" }}>
          <h2>Error: Missing Clerk Publishable Key</h2>
          <p>Please check your environment variables.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div>
        <Header />
        <div style={{ minHeight: "90vh" }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </ClerkProvider>
  );
}

export default RootLayout;
