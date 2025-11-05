import React from "react";

const img = ["assets/prtn.jpg", "assets/ecp.png"];

const Partners = () => {
  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        <section className="container px-5 py-24 mx-auto">
          <div className="text-center mb-12">
            <div className="text-4xl font-[Gloock] font-extrabold py-5 uppercase">
              Payment Partners
            </div>
          </div>
          <div className="bg-gray-100 h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="md:h-full h-100 w-full object-cover object-center"
              src={img[0]}
              alt="paymentpartners"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="md:text-4xl text-xl font-[Gloock] font-extrabold py-5 mt-5 uppercase">
              ECPAY Merchant Partners List
            </div>
            <div className="bg-gray-100 h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
              <img
                className="md:h-full h-100 w-full object-cover object-center"
                src={img[1]}
                alt="ecpaymerchant"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Partners;
