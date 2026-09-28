import Rates from "../../components/others/Rates";
import GenRates from "../../components/others/GenRates";
import PowerRateAdvisory from "../../components/others/PowerRateAdvisory";
import { getPowerRateYears, getPowerAdvisories, getGenerationCharges } from "../../services/getservices";
import { useState, useEffect } from "react";

function Advisory() {
  const [rateYears, setRateYears] = useState([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState("");

  const [advisories, setAdvisories] = useState([]);
  const [loadingAdvisories, setLoadingAdvisories] = useState(true);
  const [advisoryError, setAdvisoryError] = useState("");

  const [generationCharges, setGenerationCharges] = useState([]);
  const [loadingCharges, setLoadingCharges] = useState(true);
  const [chargesError, setChargesError] = useState("");

  useEffect(() => {
    loadRates();
    loadAdvisories();
    loadGenerationCharges();
  }, []);

  const loadRates = async () => {
    try {
      setLoadingRates(true);
      setRatesError("");
      const data = await getPowerRateYears();
      setRateYears(data || []);
    } catch (error) {
      console.error(error);
      setRatesError("Unable to load the power rates.");
    } finally {
      setLoadingRates(false);
    }
  };

  const loadAdvisories = async () => {
    try {
      setLoadingAdvisories(true);
      setAdvisoryError("");
      const data = await getPowerAdvisories();
      setAdvisories(data || []);
    } catch (error) {
      console.error(error);
      setAdvisoryError("Unable to load the power rate advisories.");
    } finally {
      setLoadingAdvisories(false);
    }
  };

  const loadGenerationCharges = async () => {
    try {
      setLoadingCharges(true);
      setChargesError("");
      const data = await getGenerationCharges();
      setGenerationCharges(data || []);
    } catch (error) {
      console.error(error);
      setChargesError("Unable to load the generation charge.");
    } finally {
      setLoadingCharges(false);
    }
  };

  return (
    <>
      <div className="bg-image2 flex min-h-screen w-full flex-col items-center">
        {/* Power Rates */}
        <section className="mt-[80px] w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <Rates 
              rateYears={rateYears}
              loadingRates={loadingRates}
              ratesError={ratesError}
            />
          </div>
        </section>

        {/* Power Rate Advisory */}
        <section className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-full">
            <PowerRateAdvisory 
              advisories={advisories}
              loadingAdvisories={loadingAdvisories}
              advisoryError={advisoryError}
            />
          </div>
        </section>

        {/* General Rates */}
        <section className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-full">
            <GenRates 
              generationCharges={generationCharges}
              loadingCharges={loadingCharges}
              chargesError={chargesError}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default Advisory;
