import React, { useState, useEffect, useRef } from "react";
import Residential from "../assets/rates/residential.jpg";
import LowVoltage from "../assets/rates/lowvoltage.jpg";
import HighVoltage from "../assets/rates/highvoltage.jpg";

import b2rate from "../assets/B2Rate.xlsx";

import { AiOutlineVerticalRight, AiOutlineVerticalLeft } from "react-icons/ai";

const featureRates = [Residential, LowVoltage, HighVoltage];
let count = 0;

const RatesCarousel = () => {
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
			<div className="flex items-center justify-center text-xl py-2 md:text-2xl lg:text-4xl font-extrabold lg:py-5 uppercase">
				Power Rates
			</div>
			<div
				ref={slideRef}
				className="w-full select-one flex justify-center items-center relative"
			>
				<div className="aspect-w-16 aspect-h-9">
					<img src={featureRates[currentIndex]} alt="rate" />
				</div>
				<div className="absolute w-full top-1/2 trasform translate-y-1/2 py-2 flex justify-between items-center">
					<button
						className="bg-black text-white p-1 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition-all duration-300"
						onClick={handleOnPreviousCLick}
					>
						<AiOutlineVerticalRight size={30} />
					</button>
					<button
						className="bg-black text-white p-1 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition-all duration-300"
						onClick={handleOnNextCLick}
					>
						<AiOutlineVerticalLeft size={30} />
					</button>
				</div>
			</div>
			<div className="flex items-center justify-center py-2">
				<a
					className="p-2 bg-white text-orange-400 rounded-lg underline hover:bg-slate-100 transition duration-300"
					href={b2rate}
				>
					Click Here to Download
				</a>
			</div>
		</section>
	);
};

export default RatesCarousel;
