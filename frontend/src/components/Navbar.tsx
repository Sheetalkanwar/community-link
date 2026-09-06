import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Explore", path: "/explore" },
    { name: "Communities", path: "/communities" },
    { name: "Matches", path: "/matches" },
    { name: "Messages", path: "/messages" },
    { name: "Requests", path: "/requests" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#fcfbff]/90 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">

        {/* Logo */}

        <Link
          to="/"
          className="group flex items-center gap-2"
        >
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white shadow-md shadow-violet-200"
          >
            L
          </motion.div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            Local<span className="text-violet-600">Link</span>
          </span>
        </Link>


        {/* Desktop navigation */}

        <nav className="hidden items-center gap-1 md:flex">

          {links.map((link) => {
            const active =
              location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative rounded-lg px-3 py-2 text-sm font-medium transition"
              >

                <span
                  className={
                    active
                      ? "text-violet-600"
                      : "text-slate-600 hover:text-violet-600"
                  }
                >
                  {link.name}
                </span>


                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-violet-600"
                  />
                )}

              </Link>
            );
          })}

        </nav>


        {/* Login */}

        <Link
          to="/login"
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-md"
        >
          Login
        </Link>

      </div>


      {/* Mobile navigation */}

      <nav className="flex overflow-x-auto border-t border-slate-100 bg-white/80 px-3 py-2 md:hidden">

        {links.map((link) => {
          const active =
            location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`min-w-max rounded-lg px-4 py-2 text-sm font-medium ${
                active
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-500"
              }`}
            >
              {link.name}
            </Link>
          );
        })}

      </nav>

    </header>
  );
}

export default Navbar;