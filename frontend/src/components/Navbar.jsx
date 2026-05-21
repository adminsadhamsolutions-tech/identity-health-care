import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import "./Navbar.css";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "#blog" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Appointment", href: "#appointment" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(prev => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        {/* LOGO */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img
            src={logo}
            alt="Identity Health Care"
            className="logo-img"
          />
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="mobile-toggle"
          onClick={handleToggle}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        {/* MENU */}
        <div className={`menu ${open ? "mobile-open" : ""}`}>

          {Array.isArray(links) && links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))
          ) : (
            <p>No menu items</p>
          )}

        </div>

      </nav>
    </header>
  );
}