import Rates from "../components/Rates";
import GenRates from "../components/GenRates";
import PowerRateAdvisory from "../components/PowerRateAdvisory";

function Advisory() {
  return (
    <>
      <div className="bg-image2 flex min-h-screen w-full flex-col items-center">

        {/* Power Rates */}
        <section className="mt-[80px] w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <Rates />
          </div>
        </section>

        {/* Power Rate Advisory */}
        <section className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-full">
            <PowerRateAdvisory />
          </div>
        </section>

        {/* General Rates */}
        <section className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-full">
            <GenRates />
          </div>
        </section>

      </div>
    </>
  );
}

export default Advisory;
