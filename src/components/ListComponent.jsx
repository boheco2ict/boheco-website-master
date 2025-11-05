import React from "react";

const pdfLogo = "assets/pdf-logo.png";

function ListComponent({ title, url }) {
  return (
    <li className="flex items-center space-x-3">
      <a className="flex items-center text-sm font-semibold" href={url}>
        <img className="w-6 h-6" src={pdfLogo} alt="pdf" />
        <span>{title}</span>
      </a>
    </li>
  );
}

export default ListComponent;
