import React from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Advisory from "./pages/Advisory";
import Partners from "./pages/Partners";
import Inquiries from "./pages/Inquiry";
import LifelineAdvisory from "./pages/LifelineAdvisory";
import NeaAdvisory from "./pages/Notice";
import { Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Privacy from "./pages/Privacy";
import DdpPspp from "./pages/DdpPspp";
// TODO:: ENABLE POPUP COMPONENT ---- LATER
// import PopupComponent from "./components/PopupComponent";

function App() {
  // TODO:: ENABLE POPUP COMPONENT ---- LATER
  // const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  // Check localStorage for privacy acceptance on component mount
  // React.useEffect(() => {
  //   const privacyAccepted = localStorage.getItem("privacyAccepted");
  //   setIsPopupVisible(!privacyAccepted);
  // }, []);
  // TODO:: END
  return (
    <div>
      <Navigation />
      {/* {isPopupVisible && <PopupComponent />} */}
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="rate-advisory" element={<Advisory />} />
          <Route path="notice" element={<NeaAdvisory />} />
          <Route path="ddpandpspp" element={<DdpPspp />} />
          <Route path="partners" element={<Partners />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="lifeline" element={<LifelineAdvisory />} />
          <Route path="privacy-notice" element={<Privacy />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
