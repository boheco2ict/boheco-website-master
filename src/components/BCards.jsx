import React from "react";

function BCards({ img, title, name, address, position }) {
  return (
    <div className="p-12">
      <div className="block p-2 rounded-lg shadow-lg bg-white max-w-sm w-72 h-auto">
        <div className="flex items-center justify-center">
          <img
            draggable={false}
            src={img}
            alt={title}
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg uppercase">{title}</h2>
          <h1 className="text-sm uppercase">{name}</h1>
        </div>
        <div className="flex flex-col items-center justify-center bg-orange-400 p-2">
          <h2 className="text-sm uppercase">{address}</h2>
          <h1 className="text-sm uppercase text-slate-700">{position}</h1>
        </div>
      </div>
    </div>
  );
}

export default BCards;
