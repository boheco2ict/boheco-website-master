const url =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";

function Cards({ path, name, title }) {
  return (
    <div className="p-12">
      <div className="block p-2 rounded-lg shadow-lg bg-white max-w-sm w-72 h-auto">
        <div className="flex items-center justify-center">
          {/* specific size from picture */}
          <img
            draggable={false}
            src={url + path}
            alt={name}
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-md uppercase">{name}</h2>
          <h1 className="text-sm uppercase text-slate-700">{title}</h1>
        </div>
      </div>
    </div>
  );
}

export default Cards;
