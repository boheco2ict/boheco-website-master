import React from "react";

function GridComponent({ title, url }) {
  return (
    <div className="p-12">
      <div className="block p-2 rounded-lg shadow-lg bg-white max-w-sm w-72 h-auto">
        <div className="flex flex-col items-center justify-center">
          <a href={url}>{title}</a>
        </div>
      </div>
    </div>
  );
}

export default GridComponent;
