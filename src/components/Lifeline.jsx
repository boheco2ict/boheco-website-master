import React, { useState, useEffect, useRef } from "react";
import { AiOutlineVerticalRight, AiOutlineVerticalLeft } from "react-icons/ai";

const img = [
  "assets/lifeline/Slide2.jpg",
  "assets/lifeline/Slide3.jpg",
  "assets/lifeline/Slide4.jpg",
  "assets/lifeline/Slide5.jpg",
  "assets/lifeline/Slide6.jpg",
  "assets/lifeline/Slide7.jpg",
  "assets/lifeline/Slide8.jpg",
  "assets/lifeline/Slide9.jpg",
  "assets/lifeline/Slide10.jpg",
  "assets/lifeline/Slide11.jpg",
  "assets/lifeline/Slide12.jpg",
  "assets/lifeline/Slide13.jpg",
  "assets/lifeline/Slide14.jpg",
  "assets/lifeline/Slide15.jpg",
];

const featureRates = [
  img[0],
  img[1],
  img[2],
  img[3],
  img[4],
  img[5],
  img[6],
  img[7],
  img[8],
  img[9],
];

let count = 0;

const Lifeline = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideRef = useRef();

  const removeAnimation = () => {
    slideRef.current.classList.remove("fade-anim");
  };

  useEffect(() => {
    slideRef.current.addEventListener("animationend", removeAnimation);
  });

  const handleOnNextCLick = () => {
    count = (count + 1) % featureRates.length;
    setCurrentIndex(count);
    slideRef.current.classList.add("fade-anim");
  };
  const handleOnPreviousCLick = () => {
    const rateLength = featureRates.length;
    count = (currentIndex + rateLength - 1) % rateLength;
    setCurrentIndex(count);
    slideRef.current.classList.add("fade-anim");
  };

  return (
    <section>
      <div className="flex justify-center text-center text-4xl font-[Gloock] font-extrabold uppercase">
        Lifeline Rate
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="lg:max-w-2xl max-w-sm">
          <img
            draggable={false}
            className="py-6"
            src={img[10]}
            alt="advisory1"
          />
          <img
            draggable={false}
            className="py-6"
            src={img[11]}
            alt="advisory2"
          />
          <img
            draggable={false}
            className="py-6"
            src={img[12]}
            alt="advisory3"
          />
          <img
            draggable={false}
            className="py-6"
            src={img[13]}
            alt="advisory4"
          />
        </div>
      </div>
      <div
        ref={slideRef}
        className="w-full select-one py-32 flex justify-center items-center relative"
      >
        <div className="aspect-w-16 aspect-h-9">
          <img draggable={false} src={featureRates[currentIndex]} alt="rate" />
        </div>
        <div className="absolute w-full top-1/2 trasform translate-y-1/2 py-2 flex justify-between items-center">
          <button
            className="bg-black text-white p-1 px-4 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition-all duration-300"
            onClick={handleOnPreviousCLick}
          >
            <AiOutlineVerticalRight size={30} />
          </button>
          <button
            className="bg-black text-white p-1 px-4 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition-all duration-300"
            onClick={handleOnNextCLick}
          >
            <AiOutlineVerticalLeft size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Lifeline;
