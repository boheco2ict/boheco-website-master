import React from "react";

const privacyNotice = "assets/privacy/01.png";
const corseal = "assets/privacy/CORSeal_BOHECOII.png";

const Privacy = () => {
  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        <section className="container px-5 py-24 mx-auto">
          <div className="text-center mb-12">
            <div className="text-4xl font-extrabold py-2 uppercase">
              <div className="flex flex-col items-center justify-center text-xl py-2 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-2 uppercase">
                <img
                  className="my-4"
                  draggable={false}
                  src={corseal}
                  alt="corseal"
                  width={250}
                  height={250}
                />
                <div>Privacy Notice</div>
                <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
                  <img
                    draggable={false}
                    src={privacyNotice}
                    alt="privacyNotice"
                    height={1020}
                    width={720}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Privacy;
