function PopupComponent() {
  const privacyNotice = "assets/privacy/CORSeal_BOHECOII.png";

  const handleAccept = () => {
    // Logic to handle acceptance of the privacy notice
    localStorage.setItem("privacyAccepted", "true");
    window.location.reload(); // Reload the page to hide the popup
  };

  return (
    <div className="h-full w-full fixed top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-16 rounded-lg shadow-lg flex max-w-6xl flex-col items-center">
        <div className="flex items-center">
          <img
            draggable={false}
            src={privacyNotice}
            alt="privacyNotice"
            height={100}
            width={100}
          />
          <h2 className="text-2xl font-bold mt-4 text-sky-500 grow-800 ml-4 gap-4">
            Data Privacy Notice
          </h2>
        </div>
        <div className="flex flex-col mt-8 text-gray-700 text-lg text-justify">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
            officiis cupiditate harum sed aspernatur accusantium. Quisquam
            veniam similique, minima aspernatur, dolores voluptatem consectetur
            asperiores veritatis sapiente necessitatibus quibusdam provident
            harum! Odio tempora praesentium id possimus soluta minus sed ratione
            vel iure animi natus a iusto omnis ipsum placeat consequatur dolor
            expedita aliquam, nisi quibusdam vero corrupti rerum quis?
            Provident, explicabo? Consequatur adipisci, laborum nam sunt
            voluptate aperiam? Quibusdam quos ducimus odit repellendus aut iste
            quaerat, veniam repudiandae deserunt nulla? Nobis veniam eaque
            laudantium id cum nulla expedita repellendus, repellat dolore?
          </p>
          <button onClick={handleAccept} className="flex justify-end pt-4">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              I Accept
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupComponent;
