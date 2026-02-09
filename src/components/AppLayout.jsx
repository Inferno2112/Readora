import { Header, Footer } from "./index";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      {/* This pushes footer to bottom */}
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default AppLayout;
