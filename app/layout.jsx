import "@/app/assets/styles/globals.css";

export const metaData = {
  title: "Korbet Property",
  keywords: "rental, property, real estate",
  description: "Find Perfect properties",
};
const MainLayout = ({ children }) => {
  return (
    <html>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default MainLayout;
