import React from "react";
import ListComponent from "../components/ListComponent";
import NoticeComponent from "../components/NoticeComponent";

function DdpPspp() {
  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        <section className="container px-5 py-24 mx-auto">
          <div className=" text-center mb-b2">
            <div className="text-4xl font-extrabold py-2">
              <div className="flex flex-col justify-center items-center">
                <ul className="flex gap-10">
                  <li>
                    <NoticeComponent
                      title={"Distribution Development Plan 2025"}
                      path={
                        "assets/annex/BOHECO II 2025-2034 DPP_page-0001.jpg"
                      }
                    />
                    <ListComponent
                      title={"BOHECO II 2025-2034 DPP"}
                      url={
                        "https://drive.google.com/file/d/1dO2WcXNDrxe4E34n4hiUWvSN-EKanzjf/view?usp=sharing"
                      }
                    />
                    <ListComponent
                      title={"ANNEX-BOHECOII-2025-2034-Grid"}
                      url={
                        "https://drive.google.com/file/d/1kiv4zLK9FDofUTJgXIMMGVgcnhOpCosL/view?usp=sharing"
                      }
                    />
                  </li>
                  <li>
                    <NoticeComponent
                      title={"Distribution Development Plan 2024"}
                      path={
                        "assets/annex/BOHECO II 2024-2033 DPP_page-0001.jpg"
                      }
                    />
                    <ListComponent
                      title={"BOHECO II 2024-2033 DPP"}
                      url={
                        "https://drive.google.com/file/d/1ExUu1-Q0i7BToOoWUaDOIf6QbX5IFM5t/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={"Annex A - BOHECO II 2024-2023 PSPP Main Grid"}
                      url={
                        "https://drive.google.com/file/d/1t2logBpOet517D5KnTCL6OGl4larqq9r/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={
                        "Annex B - BOHECO II 2024-2023 PSPP NPC Bilangbilangan"
                      }
                      url={
                        "https://drive.google.com/file/d/1atMfL5vHu3GPAZHw8mSKW04qCrX759pg/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={"Annex C - BOHECO II 2024-2023 PSPP NPC Calbul-an"}
                      url={
                        "https://drive.google.com/file/d/1tNFik1RAgZKO7ZPuwiOVw6XjL1bkwcwv/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={"Annex D - BOHECO II 2024-2023 PSPP NPC Cataban"}
                      url={
                        "https://drive.google.com/file/d/1Jf4HJ4DyLMfz_lfdscwL7UAUdTJKf4nY/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={"Annex E - BOHECO II 2024-2023 PSPP NPC Gaus"}
                      url={
                        "https://drive.google.com/file/d/11-_5RHl4ELo5ffOMUVr_Xwd5P0u7wUEZ/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={
                        "Annex F - BOHECO II 2024-2023 PSPP NPC Hingotanan"
                      }
                      url={
                        "https://drive.google.com/file/d/1TkgMTBqvBKlDKLldNacAqIH1FCaa4zYp/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={"Annex G - BOHECO II 2024-2023 PSPP NPC Malingin"}
                      url={
                        "https://drive.google.com/file/d/1kwG-_YHp4HWI3OqYd0kV2blphyIHrirJ/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={"Annex H - BOHECO II 2024-2023 PSPP NPC Maomawan"}
                      url={
                        "https://drive.google.com/file/d/1jjrhQC-7G0VNVyAySJWgws_YPot8Elcc/view?usp=drive_link"
                      }
                    />
                    <ListComponent
                      title={"Annex I - BOHECO II 2024-2023 PSPP NPC Sagasa"}
                      url={
                        "https://drive.google.com/file/d/1_LBdI-NE-SilfvFqQHA4Le9i3GjYzA_O/view?usp=drive_link"
                      }
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default DdpPspp;
