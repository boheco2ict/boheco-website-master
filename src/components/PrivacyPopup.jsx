import { useEffect } from "react";
import { useState } from "react";

const corseal =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/CORSEAL/CORSeal_BOHECOII.png";

function PrivacyPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [learnMore, setLearnMore] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("privacyAccept");

    if (!accepted) setShowPopup(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyAccept", "true");
    setShowPopup(false);
  };

  if (!showPopup) return true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        {!learnMore ? (
          <div>
            <h2 className="text-2xl font-bold text-zinc-800">Privacy Notice</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              Welcome to BOHECO II! We value your privacy and are committed to
              protecting your personal information. This privacy notice explains
              how we collect, use, and safeguard your data when you apply for
              and use our electric services. Please read this notice carefully
              to understand your rights and how we handle your information.
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              By continuing, you agree to our Privacy Policy.
            </p>
            <button
              onClick={() => setLearnMore(true)}
              className="mt-4 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              Learn More
            </button>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        ) : (
          <div className="max-h-[90vh] overflow-y-auto p-6 flex flex-col">
            <div className="flex justify-center items-center">
              <img
                src={corseal}
                alt="corseal"
                draggable={false}
                width={100}
                height={100}
              />
            </div>
            <h2 className="text-2xl font-bold text-zinc-800">Privacy Policy</h2>
            <h3 className="text-md font-bold text-zinc-800 mt-4">
              Information We Collect
            </h3>
            <p className="leading-relaxed text-zinc-600">
              When you apply for our electric services, we collect the following
              types of information:
              <ol>
                <li>
                  1. <span className="font-bold">Perosnal Information: </span>
                  This includes your name, address, contact details, and other
                  relevant identification information.
                </li>
                <li>
                  2. <span className="font-bold">Billing Information: </span>
                  We collect details related to your billing and payment
                  history.
                </li>
                <li>
                  3. <span className="font-bold">Meter Data: </span>
                  We gather data from your electric meter, including usage
                  patterns and consumption.
                </li>
                <li>
                  4.{" "}
                  <span className="font-bold">Communication Preferences: </span>
                  If you choose to receive communications from us (such as
                  newsltters or service updates), we collect your preferences.
                </li>
              </ol>
            </p>
            <h3 className="text-md font-bold text-zinc-800 mt-4">
              How We Use Your Information
            </h3>
            <p className="leading-relaxed text-zinc-600">
              We use your information for the following purposes:
              <ol>
                <li>
                  1. <span className="font-bold">Service Provision: </span>
                  To provide reliable electric services, including billing,
                  maintenance, and outage management.
                </li>
                <li>
                  2. <span className="font-bold">Compliance: </span>
                  To comply with legal and regulatory requirements related to
                  electri utilities.
                </li>
                <li>
                  3. <span className="font-bold">Customer Support: </span>
                  To address your inquiries, resolve issues, and improve our
                  services.
                </li>
                <li>
                  4. <span className="font-bold">Communication : </span>
                  To send you important notices, updates, and promotional
                  information (if you've opted in).
                </li>
              </ol>
            </p>
            <h3 className="text-md font-bold text-zinc-800 mt-4">
              Data Security
            </h3>
            <p className="leading-relaxed text-zinc-600">
              We take data security seriously. We implement technical and
              organizational measures to protect your information from
              unauthorized access, loss, or misuse.
            </p>
            <h3 className="text-md font-bold text-zinc-800 mt-4">
              Your Rights
            </h3>
            <p className="leading-relaxed text-zinc-600">
              As a BOHECO II customer, you have the following rights:
              <ol>
                <li>
                  1. <span className="font-bold">Access: </span>
                  You can request access to the personal information we hold
                  about you.
                </li>
                <li>
                  2. <span className="font-bold">Correction: </span>
                  If any of your information is inaccurate, you can ask us to
                  correct it.
                </li>
                <li>
                  3. <span className="font-bold">Erasure: </span>
                  You can request the deletion of your data under certain
                  circumstances.
                </li>
                <li>
                  4. <span className="font-bold">Objection : </span>
                  You can object to the processing of your data for specific
                  purposes.
                </li>
              </ol>
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setLearnMore(false)}
                className="flex-1 rounded-xl bg-gray-600 px-4 py-3 font-semibold text-white transition hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivacyPopup;
