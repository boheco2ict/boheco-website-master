import Rates from "../components/Rates";
import GenRates from "../components/GenRates";

function Advisory() {
  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        <section className="container px-5 py-6 mx-auto">
          <div className="text-center mb-2">
            <div className="text-4xl font-extrabold py-5 uppercase">
              <Rates />
            </div>
          </div>
        </section>
        <section className="container px-5 mx-auto">
          <div className="text-center mb-2">
            <div className="text-4xl font-extrabol uppercase">
              <GenRates />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Advisory;
