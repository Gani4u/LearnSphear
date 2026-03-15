import { Outlet } from "react-router-dom";
import { Head } from "./Head";
import { Footer } from "./Footer";

export const Topbar = () => {
  return (
    <div className="container">
      <Head />
      <main className="section">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};