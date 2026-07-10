import { Link } from "react-router-dom";

const url =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";

const developers = [
  {
    name: "Mark Kelvin Cadeliña",
    role: "Lead Programmer",
    github: "https://github.com/celcius001",
    image: "BOD/pe.png",
  },
  {
    name: "Earl Gultia",
    role: "Intern",
    github: "https://earlgultia.github.io/myprofile/",
    image: "DEVELOPERS/EG.jpeg",
  },
  {
    name: "Sherwin Madrona",
    role: "Intern",
    github: "https://asmodeus-m.github.io/MyProfile/",
    image: "DEVELOPERS/S.jpeg",
  },
  {
    name: "Jaye Melle Dela Peña",
    role: "Intern",
    github: "https://danieljm102703.github.io/JayeMelleprofile/",
    image: "DEVELOPERS/JM.jpeg",
  },
  {
    name: "Pink Acas",
    role: "Intern",
    github: "https://readerfy.github.io/Portfolio/",
    image: "DEVELOPERS/P.jpeg",
  },
  {
    name: "Cherry Inoferio",
    role: "Intern",
    github: "https://cherryinoferio.github.io/MyPortfolio/",
    image: "DEVELOPERS/C.jpeg",
  },
  {
    name: "Lea Mae Contiñeta",
    role: "Intern",
    github: "https://leamae112603.github.io/",
    image: "DEVELOPERS/LM.jpeg",
  },
  {
    name: "Renz Gamo",
    role: "Intern",
    github: "https://renz010105.github.io/",
    image: "DEVELOPERS/R.jpeg",
  },
];

const Developers = () => {
  return (
    <div className="min-h-screen bg-amber-50 px-4 py-16 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Developers/Contributors Page
        </p>
        <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          Meet the Team Behind BOHECO II Website
        </h1>
        <p className="mb-8 max-w-3xl text-base leading-7 text-slate-700">
          This section highlights the people behind the website experience, with
          each developer featured by photo, name, role, and GitHub profile link.
        </p>

        {/* Featured Developer */}
        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <img
              src={url + developers[0].image}
              alt={developers[0].name}
              className="h-64 w-full object-contain"
            />
            <div className="p-5 text-center">
              <h2 className="text-2xl font-semibold text-slate-900">
                {developers[0].name}
              </h2>
              <p className="mt-1 text-sm font-medium text-amber-700">
                {developers[0].role}
              </p>
              <a
                href={developers[0].github}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center text-sm font-semibold text-slate-700 transition hover:text-amber-700"
              >
                GitHub Profile ↗
              </a>
            </div>
          </div>
        </div>

        {/* Remaining Developers */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {developers.slice(1).map((person) => (
            <div
              key={person.name}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={url + person.image}
                alt={person.name}
                className="h-56 w-full object-contain"
              />
              <div className="p-5 text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  {person.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-amber-700">
                  {person.role}
                </p>
                <a
                  href={person.github}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-slate-700 transition hover:text-amber-700"
                >
                  GitHub Profile ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Developers;
