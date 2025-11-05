import React from "react";

const img = ["assets/l.png", "assets/m2.jpg"];

const Profile = ({ members, household, consumers, employees }) => {
  return (
    <section>
      <div className="flex justify-center text-center text-4xl font-[Gloock] font-extrabold uppercase">
        Our Profile
      </div>
      <section className="container py-8 md:pl-24 mx-auto flex  lg:flex-row flex-col-reverse md:justify-beteew justify-center">
        <div className="text-xl p-4 m-4 bg-slate-100 bg-opacity-40 shadow-lg rounded-lg cursor-pointer hover:bg-opacity-60">
          <div className="font-[Gloock] font-bold">
            BOHOL II ELECTRIC COOPERATIVE, INC. (BOHECO II )
          </div>
          <div className="leading-[50px]">
            <div>
              Date Organized:{" "}
              <span className="font-bold text-cyan-700">May 13, 1978</span>
            </div>
            <div>
              Date of First Energization:{" "}
              <span className="font-bold text-cyan-700">March 07, 1980</span>
            </div>
            <div>
              Date of Franchise Period:{" "}
              <span className="font-bold text-cyan-700">
                June 11, 1980 & March 16, 1990
              </span>
            </div>
            <div>
              Franchise Period:{" "}
              <span className="font-bold text-cyan-700">50 years</span>
            </div>
            <div>
              Certificates received from NEA:{" "}
              <span className="font-bold text-cyan-700">
                Certificate of Registration No. 105 given on May 13, 1978
              </span>
            </div>
            <div>
              Franchise Certificates:{" "}
              <span className="font-bold text-cyan-700">
                Certificate of Franchise No. 062 given on June 11, 1980 (20
                Municipalities) : Certificate of Franchise No. 139 given on
                March 16, 1990 (Bien Unido)
              </span>
            </div>
            <div>
              Franchise Area:{" "}
              <span className="font-bold text-cyan-700">
                21 Municipalities, Including Pres. Carlos P. Garcia Island
              </span>
            </div>
            <div>
              Total No. of Districts:{" "}
              <span className="font-bold text-cyan-700">9</span>
            </div>
            <div>Coverage Area per District:</div>
            <div>
              District 1:{" "}
              <span className="font-bold text-cyan-700">
                Valencia & Garcia-Hernandez
              </span>
            </div>
            <div>
              District 2:{" "}
              <span className="font-bold text-cyan-700">Jagna & Duero</span>
            </div>
            <div>
              District 3:{" "}
              <span className="font-bold text-cyan-700">Guidulman & Anda</span>
            </div>
            <div>
              District 4:{" "}
              <span className="font-bold text-cyan-700">
                Candijay, Mabini & Alicia
              </span>
            </div>
            <div>
              District 5:{" "}
              <span className="font-bold text-cyan-700">
                Ubay & Pres. Carlos P. Garcia Island
              </span>
            </div>
            <div>
              District 6:{" "}
              <span className="font-bold text-cyan-700">
                Pilar & Sierra-Bullones
              </span>
            </div>
            <div>
              <div>
                District 7:{" "}
                <span className="font-bold text-cyan-700">
                  San Miguel & Dagohoy, Danao
                </span>
              </div>
            </div>
            <div>
              <div>
                District 8:{" "}
                <span className="font-bold text-cyan-700">
                  Trinidad, Bien-Unido & Talibon
                </span>
              </div>
            </div>
            <div>
              <div>
                District 9:{" "}
                <span className="font-bold text-cyan-700">
                  Getafe & Buenavista
                </span>
              </div>
            </div>
            <div>
              <div>
                Operation Period:{" "}
                <span className="font-bold text-cyan-700">45 years</span>
              </div>
            </div>
            <div>
              <div>
                Total No. of Barangays:{" "}
                <span className="font-bold text-cyan-700">
                  491 (459 barangays within Mainland & 32 barangays within
                  islands)
                </span>
              </div>
            </div>
            <div>
              <div>
                % Energized Barangays:{" "}
                <span className="font-bold text-cyan-700">100% (On-grid)</span>
              </div>
            </div>
            <div>
              <div>
                % Residential Connections:{" "}
                <span className="font-bold text-cyan-700">94%</span>
              </div>
            </div>
            <div>
              <div>
                % Commercial/Industrial Connections:{" "}
                <span className="font-bold text-cyan-700">6%</span>
              </div>
            </div>
            <div>
              <div>
                EC Categorization as of 2023 (NEA):{" "}
                <span className="font-bold text-cyan-700">AAA</span>
              </div>
            </div>
            <div>
              <div>
                Classification (NEA):{" "}
                <span className="font-bold text-cyan-700">Mega Large</span>
              </div>
            </div>
            <div>
              <div>
                Total No. of Members:{" "}
                <span className="font-bold text-cyan-700">
                  {members} (As of December 2024)
                </span>
              </div>
            </div>
            <div>
              <div>
                Total No. Household Connections:{" "}
                <span className="font-bold text-cyan-700">
                  {household} (As of December 2024)
                </span>
              </div>
            </div>
            <div>
              <div>
                Total No. of Potential Consumers:{" "}
                <span className="font-bold text-cyan-700">
                  {consumers} (As of December 2024)
                </span>
              </div>
            </div>
            <div>
              <div>
                Average No. of Employees:{" "}
                <span className="font-bold text-cyan-700">
                  {employees} (As of December 2024)
                </span>
              </div>
            </div>
            <div>
              <div>
                Total length of lines installed:{" "}
                <span className="font-bold text-cyan-700">4,393.08 KM.</span>
              </div>
            </div>
            <div>
              <div>
                Peak Load:{" "}
                <span className="font-bold text-cyan-700">34.3 Mega Watt</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xl p-4 m-4 bg-slate-100 bg-opacity-40 shadow-lg rounded-lg cursor-pointer hover:bg-opacity-60">
          <img draggable={false} src={img[0]} alt="logo" className="py-6" />
          <img draggable={false} src={img[1]} alt="map" className="py-6" />
        </div>
      </section>
    </section>
  );
};

export default Profile;
