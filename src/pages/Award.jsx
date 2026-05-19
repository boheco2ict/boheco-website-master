import { useState } from "react";
import NoticeComponent from "../components/NoticeComponent";

const noticeData = [
  {
    title: "RECOGNIZING EXCELLENCE POWERING PROGRESS",
    path: "AWARDS/award2025.jpg",
  },
  {
    path: "AWARDS/Nea-1.jpg",
  },
  { path: "AWARDS/Nea-2.jpg" },
  { path: "AWARDS/philreca.jpg" },
];

function Award() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        <section className="container px-5 py-24 mx-auto">
          <div className="text-center mb-12">
            <div className="text-4xl font-extrabold py-2">
              <div className="flex flex-col justify-center items-center">
                <ul className="space-y-4">
                  {noticeData.map((item, index) => (
                    <li key={index}>
                      <NoticeComponent title={item.title} path={item.path} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-3xl mx-auto p-4 bg-gray-200/60 backdrop-blur-md shadow-xl roundedrounded-3xl border border-gray-200">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
              BOHECO II: A Legacy of Excellence in Rural Electrification
            </h1>
            <p className="leading-8 text-lg">
              For more than a decade, Bohol II Electric Cooperative, Inc.
              (BOHECO II) has consistently demonstrated excellence in power
              distribution, institutional management, member-consumer
              engagement, and public service. Through the years, the Cooperative
              has earned numerous recognitions from the National Electrification
              Administration (NEA), the Philippine Rural Electric Cooperatives
              Association, Inc. (PHILRECA), and various partner
              institutions—affirming its commitment to delivering reliable and
              responsive electric service to the people of Bohol.
            </p>
            <button
              onClick={() => setOpenModal(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded=xl shadow-lg transition duration-300"
            >
              Read More
            </button>
          </div>
        </section>
        {/* MODAL */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex item-center justify-center bg-black/60 px-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-fadeIn">
              {/* HEADER */}
              <div className="flex items-center justify-between border-b px-6 py-5">
                <h2 className="text-2xl font-bold text-gray-500">
                  BOHECO II: A Legacy of Excellence in Rural Electrification
                </h2>
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-3xl text-gray-500 hover:text-black"
                >
                  x
                </button>
              </div>
              {/* CONTENT */}
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                <article className="text-gray-700 leading-8 text-lg space-y-5">
                  <p>
                    For more than a decade, Bohol II Electric Cooperative, Inc.
                    (BOHECO II) has consistently demonstrated excellence in
                    power distribution, institutional management,
                    member-consumer engagement, and public service. Through the
                    years, the Cooperative has earned numerous recognitions from
                    the National Electrification Administration (NEA), the
                    Philippine Rural Electric Cooperatives Association, Inc.
                    (PHILRECA), and various partner institutions—affirming its
                    commitment to delivering reliable and responsive electric
                    service to the people of Bohol.
                  </p>
                  <p>
                    The Cooperative’s journey of recognition began gaining
                    national prominence in 2014, when BOHECO II received several
                    awards, including the DOLE Certificate of Compliance on
                    General Labor Standards, the Energy Development Corporation
                    (EDC) Loyalty Award, and a Plaque of Appreciation from NEA
                    for its contribution to the Yolanda Task Force Kapatid.
                    During the same year, BOHECO II was also recognized as part
                    of the Best Region 7 and earned its Triple-A (AAA) Rating
                    Electric Cooperative distinction. The Cooperative was
                    further commended for its contribution to the Sitio
                    Electrification Program and for achieving one of the highest
                    household connection accomplishments from 2011 to 2015.
                  </p>
                  <p>
                    In 2015, BOHECO II sustained its strong performance and
                    continued receiving recognition from NEA, including a
                    Special Award for AAA Electric Cooperative status,
                    recognition as a member of the Best Region 7, and
                    acknowledgment for its contributions to the Sitio
                    Electrification Project.
                  </p>
                  <p>
                    The years 2016 to 2018 further solidified BOHECO II’s
                    reputation as one of the country’s top-performing electric
                    cooperatives. The Cooperative consistently maintained its
                    AAA rating, achieved single-digit system loss, and posted a
                    100% total performance score under the NEA assessment.
                    BOHECO II was repeatedly recognized under the Performance
                    Excellence Award for Best Region, highlighting its
                    operational efficiency, financial discipline, and dedication
                    to quality service.
                  </p>
                  <p>
                    A defining milestone came in 2019 when BOHECO II received
                    some of the most prestigious recognitions within the
                    electric cooperative sector. Among these were the Hall of
                    Famer Award, Ace of ECs Award, Paramount Achievement Award,
                    MCO Champion Award, 5 Years of Powerhouse Excellence Award,
                    and multiple Golden Dagitab Awards. These recognitions were
                    given in acknowledgment of BOHECO II’s exemplary performance
                    as a Triple-A electric cooperative, its sustained commitment
                    to rural electrification, and its strong member-consumer
                    empowerment initiatives aligned with the goals of NEA and
                    PHILRECA.
                  </p>
                  <p>
                    Despite the operational challenges brought by the pandemic,
                    BOHECO II continued to excel in 2020 and 2021. The
                    Cooperative earned awards for service excellence,
                    occupational safety and health, multimedia and communication
                    programs, health and wellness initiatives, and
                    community-oriented programs. During the 2021 NEA Golden
                    Dagitab Awarding Ceremony, BOHECO II was recognized as an
                    Outstanding EC with AAA Rating, Most Outstanding EC with a
                    100% overall assessment rating, Most Complying EC in Audit
                    Evaluation, and recipient of the Rural Electrification
                    Program Distinction Award.
                  </p>
                  <p>
                    The Cooperative’s momentum remained strong in 2022 and 2023.
                    NEA recognized BOHECO II for excellence in collection
                    efficiency, system loss management, asset appraisal, subsidy
                    fund liquidation, AGMA participation, and advance loan
                    amortization payments. PHILRECA also honored the Cooperative
                    with awards for Outstanding Performance, Platinum Stellar
                    recognition, State-of-the-Art Workplace, Outstanding Radio
                    and TV Programs, Occupational Safety and Health Excellence,
                    Business Innovation, Digital Transformation, and Information
                    Empowerment initiatives. These awards reflected BOHECO II’s
                    growing emphasis not only on operational excellence, but
                    also on innovation, workplace development, and effective
                    consumer communication.
                  </p>
                  <p>
                    In 2024, BOHECO II once again demonstrated its unwavering
                    commitment to excellence by receiving recognitions for High
                    AGMA Attendance, Single Digit System Loss, Best Collection
                    Efficiency, Fully Liquidated Subsidy Fund, Top Performing EC
                    Award, Best Region of the Year Award, and Outstanding EC
                    Award. PHILRECA likewise recognized the Cooperative through
                    the Lumina Apex Award, Model Member-EC Award, Prompt Payor
                    Award, Platinum Stellar Award, Occupational Safety and
                    Health Excellence Award, and Quality Innovator Award.
                  </p>
                  <p>
                    These awards collectively reflect more than institutional
                    achievements—they represent the dedication of BOHECO II’s
                    Board of Directors, management, employees, and
                    member-consumers who continue to work together in advancing
                    reliable electric service and sustainable rural development
                    across the Cooperative’s coverage area.
                  </p>
                  <p>
                    As BOHECO II continues to move forward, these recognitions
                    serve both as milestones of accomplishment and as
                    inspiration to pursue even greater excellence in service,
                    innovation, and community empowerment in the years ahead.
                  </p>
                </article>
              </div>
              {/* FOOTER */}
              <div className="border-t px-6 py-4 flex justify-end">
                <button
                  onClick={() => setOpenModal(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Award;
