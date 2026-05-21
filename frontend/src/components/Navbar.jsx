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

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        {/* LOGO */}
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="Identity Health Care"
            className="logo-img"
          />
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

        {/* MENU */}
        <div className={`menu ${open ? "mobile-open" : ""}`}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

      </nav>
    </header>
  );
}