import React from "react";
import BCards from "./BCards";

const img = [
  "assets/bod/BOD1-d.jpg",
  "assets/bod/BOD2-d.jpg",
  "assets/bod/BOD3-d.jpg",
  "assets/bod/BOD4-d.jpg",
  "assets/bod/BOD5-d.jpg",
  "assets/bod/BOD6-d.jpg",
  "assets/bod/BOD7-d.jpg",
  "assets/bod/BOD8-d.jpg",
  "assets/bod/BOD9-d.jpg",
  "assets/pe.png",
];

const CardBoard = () => {
  return (
    <section>
      {/* MANAGEMENT */}
      <div className="flex justify-center text-center text-4xl font-[Gloock] font-extrabold uppercase">
        Board Of Directors
      </div>
      <section className="flex justify-center items-center">
        <BCards
          img={img[4]}
          title={"DISTRICT V REPRESENTATIVE"}
          name={"Noel D. Villanueva"}
          address={"UBAY & CPG ISLAND"}
          position={"PRESIDENT"}
        />
      </section>
      <section className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
        <BCards
          img={img[7]}
          title={"DISTRICT VIII REPRESENTATIVE"}
          name={"ROBERTO O. LANGAMEN"}
          address={"TRINIDAD, BIEN-UNIDO & TALIBON"}
          position={"1ST VICE-PRESIDENT"}
        />
        <BCards
          img={img[3]}
          title={"DISTRICT IV REPRESENTATIVE"}
          name={"SIXTO B. BUDIONGAN JR"}
          address={"CANDIJAY, MABINI & ALICIA"}
          position={"2ND VICE-PRESIDENTCHIEF PRO"}
        />
        <BCards
          img={img[1]}
          title={"DISTRICT II REPRESENTATIVE"}
          name={"GENARO D. MENDE"}
          address={"JAGNA & DUERO"}
          position={"SECRETARY"}
        />
        <BCards
          img={img[2]}
          title={"DISTRICT III REPRESENTATIVE"}
          name={"CHRISTINE G. LAGURA"}
          address={"GUINDULMAN & ANDA"}
          position={"TREASURER"}
        />
      </section>
      <section className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
        <BCards
          img={img[5]}
          title={"DISTRICT VI REPRESENTATIVE"}
          name={"RUEL E. MABAQUIAO"}
          address={"PILAR & SIERRA-BULLONES"}
          position={"AUDITOR"}
        />
        <BCards
          img={img[6]}
          title={"DISTRICT VII REPRESENTATIVE"}
          name={"CRISTITA A. CERICOS"}
          address={"SAN MIGUEL, DAGOHOY & DANAO"}
          position={"CHIEF PRO"}
        />
        <BCards
          img={img[8]}
          title={"DISTRICT IX REPRESENTATIVE"}
          name={"ARNULDO S. LUGOD"}
          address={"GETAFE & BUENAVISTA"}
          position={"PRO I"}
        />
        <BCards
          img={img[9]}
          title={"DISTRICT II REPRESENTATIVE"}
          name={"Danilo C. Cadiz"}
          address={"G-HERNARDEZ, VALENCIA"}
          position={"PRO II"}
        />
      </section>
    </section>
  );
};

export default CardBoard;
