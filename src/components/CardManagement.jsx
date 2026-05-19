import MCards from "./MCards";

const path = [
  "MANAGEMENT/GM-d.jpg",
  "MANAGEMENT/TSD-d.jpg",
  "MANAGEMENT/ISD-d.jpg",
  "MANAGEMENT/ELLEN-d.jpg",
  "MANAGEMENT/ADRIAN-d.jpg",
  "MANAGEMENT/CORPLAN-d.jpg",
  "MANAGEMENT/UBAY-d.jpg",
  "MANAGEMENT/TALIBON-d.jpg",
];

const CardManagement = () => {
  return (
    <section>
      {/* MANAGEMENT */}
      <div className="flex justify-center text-center text-4xl font-[Gloock] font-extrabold uppercase">
        Management
      </div>
      <section>
        {/* GENERAL MANAGER */}
        <div className="flex justify-center items-center">
          <MCards
            path={path[0]}
            name={"Eugenio R. Tan, REE, MPA"}
            title={"General Manager"}
          />
        </div>

        {/* DEPARMENT MANAGERS */}
        <div className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
          <MCards
            path={path[1]}
            name={"Noel M. Aleman, REE, MPA"}
            title={"TSD Manager"}
          />
          <MCards
            path={path[2]}
            name={"Tito O. Andamon, MPA"}
            title={"ISD Manager"}
          />
          <MCards
            path={path[3]}
            name={"Ellen O. Bayhon, CPA, MPA"}
            title={"FSD Manager"}
          />
          <MCards
            path={path[4]}
            name={"Adrian C. Forones, CPA"}
            title={"Acting Internal Auditor"}
          />
        </div>

        <div className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
          {/* OFFICE OF THE GENERAL MANAGER */}
          <MCards
            path={path[5]}
            name={"Ariel G. Torrejos, REE, RME, MPA"}
            title={"Corporate Planning Manager"}
          />
          {/* AREA OFFICE MANAGERS */}
          <MCards
            path={path[6]}
            name={"Vicente P. Melencion, Jr., REE"}
            title={"Ubay Area Manager"}
          />
          <MCards
            path={path[7]}
            name={"Raywin Q. Flor, REE, MPA"}
            title={"Talibon Area Manager"}
          />
        </div>
        {/* END OF MANAGEMENT */}
      </section>
    </section>
  );
};

export default CardManagement;
