import "@/assets/styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./components/authProvider";
import { Toaster } from "sonner";
import { GlobalContextProvider } from "./utils/context/GlobalContext";

export const metaData = {
  title: "Korbet Property",
  keywords: "rental, property, real estate",
  description: "Find Perfect properties",
};
const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <GlobalContextProvider>
        <html>
          <body>
            <Navbar />
            <main>{children}</main>
            <Toaster richColors position="top-center" />
            <Footer />
          </body>
        </html>
      </GlobalContextProvider>
    </AuthProvider>
  );
};

export default MainLayout;
