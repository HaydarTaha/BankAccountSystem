import React from "react";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 text-center">
      &copy; {new Date().getFullYear()} Bank Account System. Developed by
      <span
        className="fw-bold"
        onClick={() => window.open("https://github.com/omercsbn")}
        style={{ cursor: "pointer" }}
      >
        {" "}
        Ömercan
      </span>{" "}
      and{" "}
      <span
        className="fw-bold"
        onClick={() => window.open("https://github.com/HaydarTaha")}
        style={{ cursor: "pointer" }}
      >
        Haydar Taha
      </span>
      .
    </footer>
  );
};

export default Footer;
