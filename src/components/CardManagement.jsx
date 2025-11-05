import React from "react";
import MCards from "./MCards";

const img = [
  "assets/management/GM-d.jpg",
  "assets/management/TSD-d.jpg",
  "assets/management/ISD-d.jpg",
  "assets/management/ELLEN-d.jpg",
  "assets/management/ADRIAN-d.jpg",
  "assets/management/CORPLAN-d.jpg",
  "assets/management/UBAY-d.jpg",
  "assets/management/TALIBON-d.jpg",
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
            img={img[0]}
            name={"Eugenio R. Tan, REE, MPA"}
            title={"General Manager"}
          />
        </div>

        {/* DEPARMENT MANAGERS */}
        <div className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
          <MCards
            img={img[1]}
            name={"Noel M. Aleman, REE, MPA"}
            title={"TSD Manager"}
          />
          <MCards
            img={img[2]}
            name={"Tito O. Andamon, MPA"}
            title={"ISD Manager"}
          />
          <MCards
            img={img[3]}
            name={"Ellen O. Bayhon, CPA, MPA"}
            title={"FSD Manager"}
          />
          <MCards
            img={img[4]}
            name={"Adrian C. Forones, CPA"}
            title={"Acting Internal Auditor"}
          />
        </div>

        <div className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
          {/* OFFICE OF THE GENERAL MANAGER */}
          <MCards
            img={img[5]}
            name={"Ariel G. Torrejos, REE, RME, MPA"}
            title={"Corporate Planning Manager"}
          />
          {/* AREA OFFICE MANAGERS */}
          <MCards
            img={img[6]}
            name={"Vicente P. Melencion, Jr., REE"}
            title={"Ubay Area Manager"}
          />
          <MCards
            img={img[7]}
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
