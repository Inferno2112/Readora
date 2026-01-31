import { Header, Footer } from "./index";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900">
      <Header />

      {/* This pushes footer to bottom */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default AppLayout;
