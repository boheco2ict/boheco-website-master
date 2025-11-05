import React from "react";

import Section from "../components/Section";
import Glance from "../components/Glance";
import Profile from "../components/Profile";
import CardManagement from "../components/CardManagement";
import CardBoard from "../components/CardBoard";

const About = () => {
  /* PROFILE */
  const members = "158,713";
  const household = "178,051";
  const consumers = "162,595";
  const employees = "279";

  return (
    <div className="bg-image2 flex flex-col items-center justify-center overflow-hidden">
      <Section />
      <Glance employees={employees} />
      <Profile
        members={members}
        household={household}
        consumers={consumers}
        employees={employees}
      />
      <CardBoard />
      <CardManagement />
    </div>
  );
};

export default About;
