import React from "react";

const About = ({ employees }) => {
  return (
    <section>
      {/* AT A GLANCE */}
      <div className="flex justify-center text-center text-4xl font-[Gloock] font-extrabold uppercase">
        Bohol II Electric Cooperative, Inc.
      </div>
      <section className="container py-8 md:pl-24 mx-auto flex  lg:flex-row flex-col md:justify-beteew justify-center">
        <div className="text-xl p-4 m-4 bg-slate-100 bg-opacity-40 shadow-lg rounded-lg cursor-pointer hover:bg-opacity-60">
          Its main office is located at Cantagay, Jagna, Bohol. It has two area
          offices, namely: Ubay Area Office at Poblacion, Ubay, Bohol and
          Talibon Area Office at Circumferential Road, San Jose Talibon, Bohol.
          It has an average of {employees} employees. The cooperative was
          organized on May 13, 1978 and its first energization was on March 7,
          1980, and then was given certificate of Franchise from National
          Electrification Administration on June 11, 1980, bringing along
          electricity to 21 municipalities including Pres. Carlos P. Garcia
          Island. BOHECO II has proven to be an important contributor to the
          economic and social development of Bohol as its march to progress,
          providing sufficient power supply both public and private
        </div>
        <div className="text-xl p-4 m-4 bg-slate-100 bg-opacity-40 shadow-lg rounded-lg cursor-pointer hover:bg-opacity-60">
          business entities and facilities in the province. It brought
          convenience to every home and generates livelihood opportunities in
          the communities. The challenge of providing sufficient power supply
          and greater service coverage to consumers brought BOHECO II as an
          indispensable partner in the province of BOHOL and the entire
          Philippines thatup to now, BOHECO II remained a driver to the economic
          engine of Bohol, a cooperative that continues to contribute the
          countryside's economic development. Over the years, BOHECO II has
          proven to be a dedicated and reliable partner of NEA in warranting its
          goals in energizing the households of the far-flung
        </div>
        <div className="text-xl p-4 m-4 bg-slate-100 bg-opacity-40 shadow-lg rounded-lg cursor-pointer hover:bg-opacity-60">
          areas greatly effecting change and bridging the lives of Boholanos
          through the Sitio Electrification Projects (SEP) and Barangay Line
          Enhancement Program (BLEP), bringing light and improving lives of
          every household. BOHECO II is one part of the solution to address
          electrification challenges of the nation, and we have a crucial role
          to play. Providing energy access to all Boholanos is a key to
          development and poverty alleviation, it is a stepping-stone and a
          foundation to improving Boholano’s lives. We further believe that
          BOHECO II will surpass its present status to become a more progressive
          Electric Cooperative while being more and more resilient to future
          hurdles.
        </div>
      </section>
    </section>
  );
};

export default About;
