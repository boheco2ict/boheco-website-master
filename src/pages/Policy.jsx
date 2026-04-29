import React from "react";
import axios from "axios";
import ListComponent from "../components/ListComponent";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const policyData = [
  {
    year: 2026,
    title: "Policy No. 187 - Gate Pass Policy",
    url: "https://drive.google.com/file/d/1bdXLFWXgDyLhf7G7kH5CsQysOzvFuqTB/view?usp=drive_link",
  },
  {
    year: 2026,
    title: "Policy No. 188 - Meal Allowances and DTE",
    url: "https://drive.google.com/file/d/1sCaWkMVgKQevmsQeQebz1RUeKYEyzYAZ/view?usp=drive_link",
  },
  {
    year: 2026,
    title: "Policy No. 189 - Disconnection Policy",
    url: "https://drive.google.com/file/d/1VkODMRVSulvSQBsHBNI2rzH6GrXHagHx/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 172 - No MCT, No Issuance Policy",
    url: "https://drive.google.com/file/d/1Q4N0k6b6qz10gcVaWpbwlSTPZawvw4G2/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 173 - Commitee on Inspection and Acceptance",
    url: "https://drive.google.com/file/d/1I7vobwlDhQGx-nAkUqQqm40dNjy5YYrN/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 174 - Employees' Leave and Monetization",
    url: "https://drive.google.com/file/d/16eMCxpx7nItLyYwt_WHwC8qbsz0hhvSO/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 174-A - Employees' Leave and Monetization (Revised)",
    url: "https://drive.google.com/file/d/1vRZ1Mo6nENogPneH9y4mkmlMR0PUYNcS/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 175 - Pabaon Program for Separated Employees",
    url: "https://drive.google.com/file/d/1zGSYRqZeAmHd0i9OoCw-e9fD1fZMD-V6/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 176 - Death Assistance Policy",
    url: "https://drive.google.com/file/d/1PEtZ1aE-mM33TfgjSFLbIm-FaBMHsjc7/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 177 - Cash Handling Policy",
    url: "https://drive.google.com/file/d/1txlcKezc2P_Z3Shxe7O49ORnCpxcimBr/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 178 - Medical Coverage for Road Accidents",
    url: "https://drive.google.com/file/d/1MQCzZY3aToMkKJCGV9qVdGAEbW_PZ8rG/view?usp=drive_link",
  },
  {
    year: 2025,
    title:
      "Policy No. 179 - Electric Pilferage-Penalties, Differential Billing, and Settlement Guidelines",
    url: "https://drive.google.com/file/d/16HdO24GpQtqKWOnNrwEcGcYqURWp0DX4/view?usp=drive_link",
  },
  {
    year: 2025,
    title: "Policy No. 180 - Employee Benefits, Awards, and Incentives",
    url: "https://drive.google.com/file/d/1tycZ7pLaPymN_dGGviMKsNmIZSxVJTWB/view?usp=drive_link",
  },
  {
    year: 2025,
    title:
      "Policy No. 181 - No Preferential Treatment in Electric Bill Penalty Enforcement",
    url: "https://drive.google.com/file/d/1k0No9xqaTwFBNVQR80k5-0AQJJg2QPI9/view?usp=drive_link",
  },
  {
    year: 2025,
    title:
      "Policy No. 182 - Handling, Usage, and Replenishment of Petty Cash and Revolving Funds",
    url: "https://drive.google.com/file/d/1U_iLSwvIMnIkC5VPl6JLB7Tq0POY0D-t/view?usp=drive_link",
  },
  {
    year: 2025,
    title:
      "Policy No. 183 - Selection and Appointment of the General Manager and Officer-in-Charge",
    url: "https://drive.google.com/file/d/1pV8N511AVR8CLMKSieNWBaSRCexbz6Sa/view?usp=drive_link",
  },
  {
    year: 2025,
    title:
      "Policy No. 184 - Political Neutrality and Non-Intervention in Governance Processes",
    url: "https://drive.google.com/file/d/1QGpqHXOnZXSQo9hracd5v2FgpjscFf_f/view?usp=drive_link",
  },
  {
    year: 2025,
    title:
      "Policy No. 185 - Safeguarding the Cooperative from Undue Private Sector Influence",
    url: "https://drive.google.com/file/d/1FTvngyxJdamm7mjo7iXRsCBw2lO5h5yf/view?usp=drive_link",
  },
  {
    year: 2025,
    title:
      "Policy No. 186 - Executive Succession and Organizational Continuity",
    url: "https://drive.google.com/file/d/1OZMp5elFdXKDhbhssD9WnROYXvEmuJWb/view?usp=drive_link",
  },
  {
    year: 2022,
    title: "Policy No. 37-a - Vehicular Accident Counterpart (2022 Revision)",
    url: "https://drive.google.com/file/d/170_SXc5bkVmyhOA9gydICtFnQ_qmktvz/view?usp=drive_link",
  },
  {
    year: 2022,
    title:
      "Policy No. 162A - Creation of Position, Selection of Personnel, Hiring, Promotion, etc. [amended]",
    url: "https://drive.google.com/file/d/1y_2RFtHvmpbW-e25ZXFOGKCGD3Cmxrvp/view?usp=drive_link",
  },
  {
    year: 2020,
    title:
      "Policy No. 168 - Standard Connection Facilities for Electrical Connection",
    url: "https://drive.google.com/file/d/13mpkN84vmleX0EDta0f40wJQzq4gSx0g/view?usp=drive_link",
  },
  {
    year: 2020,
    title: "Policy No. 169 - Employees Dayoff and Leave Credits",
    url: "https://drive.google.com/file/d/1r-SM1eVs4qQm-lpFi6EMQlAfH9U-sywg/view?usp=drive_link",
  },
  {
    year: 2020,
    title: "Policy No. 170 - Internet, Mobile Phone and Data Usage",
    url: "https://drive.google.com/file/d/17ku5_68uHs6vksa14sS18ndAf5jjRTid/view?usp=drive_link",
  },
  {
    year: 2020,
    title: "Policy No. 171 - Guidelines for Merit Increase & Rank Adjustment",
    url: "https://drive.google.com/file/d/14IJ-rphuZpO8l00V8yed-8_RC8KXafIt/view?usp=drive_link",
  },
  {
    year: 2019,
    title: "Policy No. 166 - Incorporation of Balances to Electric Bills",
    url: "https://drive.google.com/file/d/1So2CQYuCzsM59CQgErozJaL3ABeIJgv5/view?usp=drive_link",
  },
  {
    year: 2019,
    title: "Policy No. 167 - Birthday Gift",
    url: "https://drive.google.com/file/d/1RV-2phzka2afhBkza9QZUTMtMSuq2qkr/view?usp=drive_link",
  },
  {
    year: 2017,
    title: "Policy No. 165 - Study Now Pay Later",
    url: "https://drive.google.com/file/d/1LfrHV7mGxJH9NvnxMdSDuFs--blCOqrn/view?usp=drive_link",
  },
  {
    year: 2016,
    title: "Policy No. 163 - Safety Policy for Linemen and Employees",
    url: "https://drive.google.com/file/d/1AdCh9mLHyf6RLSiumC8YBopoCx3LtaUa/view?usp=drive_link",
  },
  {
    year: 2016,
    title: "Policy No. 164 - No Noon Break",
    url: "https://drive.google.com/file/d/1cIGsWEATYZRF0xtAMQl0pHr_AaMWzYSA/view?usp=drive_link",
  },
  {
    year: 2015,
    title:
      "Policy No. 162 - Creation of Position, Selection of Personnel, Hiring, Promotion, etc.",
    url: "https://drive.google.com/file/d/1vDkfx-V6LCKMSVkdtxC-6OmKPlBYMrkZ/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 2-1 - Position Description",
    url: "https://drive.google.com/file/d/1WSdNn04uAqZnAurVYxRoqtTB2YzT80XI/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 3-1 - Selection-Hiring of Personnel",
    url: "https://drive.google.com/file/d/1bVDbEe3W1g-MiPkQ4eLHsHjm17nrfQWS/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 3-2 - Grounds for Employee Termination",
    url: "https://drive.google.com/file/d/10wsiZWyFqJtdjtuMqjiSRUF8BFpNiyWj/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 3-4 - Organization Chart",
    url: "https://drive.google.com/file/d/1u-Iq1obaXgMqu0D6rWRr7S_Oqey8PxYv/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 3-5 - Staff Meeting",
    url: "https://drive.google.com/file/d/1uKyfVAz4SNsCt7YFLTWqy6reLJx_jCh8/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 3-6 - Performance appraisal-upgrading of coop employees",
    url: "https://drive.google.com/file/d/14bRJykh3DDA_ogb7IK3ZjfCifpjOaSpV/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 5-2 - Special Lighting",
    url: "https://drive.google.com/file/d/1_bsI09frqgX9ExWHwoLdC9PWpeJKKKnC/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 5-2A - Use of Cooperative Vehicle",
    url: "https://drive.google.com/file/d/1JDAi00clZn43L87Bzp-u7ZJjc0DstC9h/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 5-3 - Securing Right of Way",
    url: "https://drive.google.com/file/d/13MMzujyWy1jnGi-3385ignZPt97NHP4p/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-1 - Housewiring Installation (Labor)",
    url: "https://drive.google.com/file/d/1TlYCY_OpRZgCBkskc9DhtkoKfJvjvKq5/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-2 - Illegal Procurement and Pilferage of Electricity",
    url: "https://drive.google.com/file/d/1w0qqjbxaJ2EirmbDtE0hbFPnL2q93JoU/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-2A - Penalty for Delinquent Bills",
    url: "https://drive.google.com/file/d/1w0qqjbxaJ2EirmbDtE0hbFPnL2q93JoU/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-2B - Service Connection",
    url: "https://drive.google.com/file/d/1fWIMWaWsYpUZzqPGLKkhh4jeAX44SBjY/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-3 - Service Classification",
    url: "https://drive.google.com/file/d/1np5sp7TPjrhFOonQZjZb73cqdHX-08AD/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-3A - Power supply on large load consumer",
    url: "https://drive.google.com/file/d/18HHpE06dZ3XZQYdiYnezCCVvf6ikReeh/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-3B - Barangay Chapel Service Connection",
    url: "https://drive.google.com/file/d/14msKUtYztOHlmS9yRrapVV9J0e8ovGqn/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-4 - Housewiring Loan (no longer implemented)",
    url: "https://drive.google.com/file/d/15IxqouPLbg0Qb3hIC06cnVnrkKemgPn_/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-5 - Meter Inspection and Calibration",
    url: "https://drive.google.com/file/d/1plO-4v3TWuxD2JEzqIiq7vgJ64XaBfH3/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 6-11 - Minimum Billing for Industrial Consumer",
    url: "https://drive.google.com/file/d/197-LZANRE4X_r3560BVRg2AXYaZd7mws/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 8-1 - Newsletter",
    url: "https://drive.google.com/file/d/1pFoaJmsTJpOeumEck1sL3h9k10kj6Bc-/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 8-2A - Membership Qualifications and Recruitment",
    url: "https://drive.google.com/file/d/1XMt8E6Jt8S31czmf7kScE50KdZQZgTnc/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 8-2B - Application for Transfer of Membership in Case of Death of Member or Withdrawal of Membership Due to Disability",
    url: "https://drive.google.com/file/d/1KUDgPEjcwzuZNyMOBPJ93ggHXj_1o3ql/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 8-2C - Grounds for Denying Membership Application",
    url: "https://drive.google.com/file/d/1KUDgPEjcwzuZNyMOBPJ93ggHXj_1o3ql/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 8-2D - Change of Membership Status",
    url: "https://drive.google.com/file/d/1lyzPJO2oTNr6ipKJ_Kp56s51FcYGQRcV/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 8-3 - Membership Certificate",
    url: "https://drive.google.com/file/d/1hQOVY7KNqwIJExTKZrg1L1w8qQ4C0ex9/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 8-3A - Membership ID Cards",
    url: "https://drive.google.com/file/d/1PHY5cCr2AMz_gUnWU5VBrdbl0wK3g_xU/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 8-8 - Members Right to Examine Coop Books",
    url: "https://drive.google.com/file/d/1FaVhvpUtMKqpbjv8dKYKBIG38pnCbGvC/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 10 - Administrative Actions of Specific Offenses",
    url: "https://drive.google.com/file/d/1HtPghX9dGrVIJLJlIcuw-qKdvWl_VAeX/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 12 - Amendment on Policy No. 6-2A - Penalty for Deliquent Bills",
    url: "https://drive.google.com/file/d/1HlUgt5uy8aqcCl120FV3BM48zPeE6MHz/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 14A - Amendment of Policy No. 14 - Policy on Pilferage of Electricity and Illegal Connections",
    url: "https://drive.google.com/file/d/1skfGRtBuXEThrmT5YEDpJPvlQjDTf9dw/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 15 - Addendum to Policy No. 12 - Penalty for Delinquent Bills or Disconnected Consumers in Lieu of Consumer Deposits",
    url: "https://drive.google.com/file/d/1FjWx6loEuXVVCtN8sqaYU1oB0_-2qp7_/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 17 - kWh Meters of Disconnected Consumers",
    url: "https://drive.google.com/file/d/1FjWx6loEuXVVCtN8sqaYU1oB0_-2qp7_/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 18 - Application for the Position of General Manager by any Board Member",
    url: "https://drive.google.com/file/d/1PnpvSKK6fM3IQioHe1q0MZwUHDkekld-/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 20 - Installation of Capacitors for Industrial Consumers",
    url: "https://drive.google.com/file/d/1UP7vehi4S-ArTHg7E3xMl6IYsqWj4d5L/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 21 - Bonding of Real Properties for Employees who are Handling Money",
    url: "https://drive.google.com/file/d/1d8UE2f8yhj8Zb-Sqg7Trm1vmefI8VzkA/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 22 - Amending of Policy No. 6-2A and No. 12 on Penalty for Delinquent Bills",
    url: "https://drive.google.com/file/d/1JBmj1n2UeLgKZ9dc6l77fFk2-Hh8B_2q/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 23 - Membership Orientation Seminar",
    url: "https://drive.google.com/file/d/1wmD65lnucmt4vSHuN_loV4C3MMuEKQF_/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 25 - Meter Deposit (no longer implemented)",
    url: "https://drive.google.com/file/d/1PVArtyDVul4vrwQvWT5yzjyFsiIKw5Xh/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 27 - Coop Employees Vacation and Sick Leave",
    url: "https://drive.google.com/file/d/1Aph_MAJuTREEvOUPTeLH3EAkbP8FQ0al/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 28 - Advances of Salaries and Wages",
    url: "https://drive.google.com/file/d/1h-LmkXN0AyUYWZTkI2a5OolSwMtmPk5d/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 29 - Gasoline and Oil Issuance",
    url: "https://drive.google.com/file/d/1Kfl1tLerd6Ma4NwvrCWqLylktd9GLQm-/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 31 - Reconnection of Disconnected Consumers",
    url: "https://drive.google.com/file/d/1BuO8GnLM4PB6CZeLTX7frm4fT4QxEhiD/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 32 - Engineering and Technical Committee",
    url: "https://drive.google.com/file/d/1BD3fjPZtSecz6xRRkD3fpgiHshCB00YG/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 36 - Compulsory Requirement of PHILAMCARE Membership",
    url: "https://drive.google.com/file/d/1ITHqtfRJLFBdo-58DcxJYDPf3YyynDXf/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 37 - Imposition of Driver's Percentage Counterpart Involved in Vehicular Accident",
    url: "https://drive.google.com/file/d/1Xl7Gn0rMd7wlxD3E7Fa2F93upIDBoy35/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 38 - Policy on Purchases",
    url: "https://drive.google.com/file/d/1t4sj_qzEWh3pvtF-gJGJrlMc4zmUtv74/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 39 - Modification of the penalty imposed to delinquent commercial member-consumers, service fee for reconnection and grace period for payment of power bill",
    url: "https://drive.google.com/file/d/1QLohsiIG4-mnkuyOtrcvPqlgEUMxXX1G/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 40 - Meter replacement of non-functional kwh meters",
    url: "https://drive.google.com/file/d/1Whu1zsPme29wnn5IXRNZOht-HFzRk2uZ/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 41 - Increasing the number of hours charged to street lights",
    url: "https://drive.google.com/file/d/1tHYQ2Zrv2eDWu9cXB2VqIWw4Qb4mPm1L/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 43 - Transformer Core Loss to Form Part on Sole User's Consumption",
    url: "https://drive.google.com/file/d/1mjYwhdW7vg3pVF8KZJkqbM1mh2SKPwwr/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 44-a - Meter Reading, Collection & Disconnection Scheme",
    url: "https://drive.google.com/file/d/1YL560JeYVjFPY7N7ttzgAmttVs7BGzyR/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 45 - Placement of Main Meter in Clustered Houses Using Substandard Secondary Installation",
    url: "https://drive.google.com/file/d/1zTHRspwsM4o7gUlHw-YmTeSqTpBd63-C/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 46 - Best BAPA Awards Criteria",
    url: "https://drive.google.com/file/d/1pACViqLlQqAP9kJFZ9clxiYjnq4PDdlD/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 47 - Requiring all forms of entertainment... to have their own transformer",
    url: "https://drive.google.com/file/d/15B-rflGjr7Pu28RZuu7DtzPOSgqnFNa8/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 48 [Amending Policy 14-a, 6-2] - Penalties for Tampering of kWh Meters, Illegal Reconnection and Connection....",
    url: "https://drive.google.com/file/d/1xNjID8xX5ua4tHMD2Cq-8DIOReXFnwzw/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 49 - Bill Discount and Surcharges",
    url: "https://drive.google.com/file/d/1lP8W9AQb5EZT2QrZnxK4ZcYAxNsCW7t8/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 50 - Collection of Electric Bill and Disconnection of Power Service",
    url: "https://drive.google.com/file/d/1PuenQomAbGL-VabNBbcFdICKYeMshxwl/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 51 - Maintenance of Consumer's Supplied Poles....",
    url: "https://drive.google.com/file/d/1-3HaDZynRa-7d8b3EtlVidiNkyMUCNrM/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 52 - New Rate of Calibration, Meter Check-up Deposit",
    url: "https://drive.google.com/file/d/1yZo4OhHULo4SSiCVCLeyuTYNmuMsp0J4/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 53 - Renewal of the Memorandum of Agreement Between BOHECO II and BAPA (as modified)",
    url: "https://drive.google.com/file/d/1VuYVn1YhmJFOHnjh3pEUdzc8sQg9n8G8/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 55 - Special Service Connection",
    url: "https://drive.google.com/file/d/1fDtpedrMGW_hJEAGDCm4Xa5cjdAI-ffY/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 56 - Employees Dangerous Drug Test",
    url: "https://drive.google.com/file/d/1NbUMYPdOVt66uqb6vHESjm5uFMbojVgH/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 57 - Motorcycle Loan",
    url: "https://drive.google.com/file/d/1cxmwUIWtZ8820g0XnyLPNa4WPLyS-Os5/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 58 - Requirement of Documents or Receipts of Materials Prior to Coop Installation",
    url: "https://drive.google.com/file/d/1moSXY9Z2dAQZZI8f4hzO9BeVV0_Z1LNT/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 59 - Urging Consumers Using Bamboo or Light Pole to Replace with the Standard One (Steel or Concrete)",
    url: "https://drive.google.com/file/d/1ahmcRAwqvBOF6--4A-p3oiaT9csbBRfI/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 60 - Service Drop Installation Fee for New Additional Connection",
    url: "https://drive.google.com/file/d/1yOc1hFlTPsP1Qvi19MSlc_TVRPLlvoVK/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 61 - Private Service and Metering Requirement for Fence - Consumer's Facilities",
    url: "https://drive.google.com/file/d/17IFooCrojxhPn-F1r0EFG9_RwcGfQ8Cd/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 62 - Inspection Fee for New Installation",
    url: "https://drive.google.com/file/d/1MbN04Y4taPOaVsTUJznMELCLm-73HZKe/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 63 - Safety Policy of All Linemen",
    url: "https://drive.google.com/file/d/1f16Rma7TXySkesSBrR4IahorKyc0h_a9/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 64 - Energy & Bill Deposits",
    url: "https://drive.google.com/file/d/12K6QXTfMu4bLMx3-8JtGzED7FxyVx9xZ/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 68 - Financial Claim Due to Electrocution",
    url: "https://drive.google.com/file/d/1YrLJ0vkOdrSJ5t6MBIh-fcYyLItNVbDD/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 69 - Specified Right of Electric Service",
    url: "https://drive.google.com/file/d/1uhxfl9DdEE8O2cyPpme1kb5c1IJVd9wl/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title:
      "Policy No. 70 - Addendum to Policy No. 41 - Street Light Installation",
    url: "https://drive.google.com/file/d/1N5I0sgLykftOy21Etef9teeeNxscc65g/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 71 - Corporate Governance",
    url: "https://drive.google.com/file/d/1nHdzznrifeMn2p7d6BidtJUfOuWFliRm/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 80 - Treatment of Cut-off Delinquent CAR",
    url: "https://drive.google.com/file/d/1XFUB-DtytAnStl3hLINNJdtfyN9D9Tj1/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 81 - Implementation of Computerized Inventory System",
    url: "https://drive.google.com/file/d/1or97G05pJpb4SWmpSNNoGO3Ahi3d_WoO/view?usp=drive_link",
  },
  {
    year: "Compilation of Old Policies",
    title: "Policy No. 82 - Cash Reward to Informer of Electric Pilferage",
    url: "https://drive.google.com/file/d/1PVK_4YzlX5wNmQOOIhX9DLmvFMNa2EPa/view?usp=drive_link",
  },
];

function Policy() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  // Check Auth on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoggedIn(false);
          setAuth(false);
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://bill-inquiry-api.onrender.com/api/v1/login/auth",
          {},
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        if (response.data.message === "Unauthorized") {
          localStorage.clear();
          setIsLoggedIn(false);
          setAuth(false);
        } else {
          setIsLoggedIn(true);
          setAuth(response.data.auth);
        }
      } catch (error) {
        console.error("Auth Error", error);
        setIsLoggedIn(false);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validRegEx = /^[^\\&']*$/;
    if (!user.match(validRegEx)) {
      setMsg("Unauthorized");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://bill-inquiry-api.onrender.com/api/v1/login",
        { user, pwd },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.auth) {
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        setAuth(true);
      } else {
        setMsg("Unauthorized");
      }
    } catch (error) {
      // console.error(error);
      if (error.message === "Network Error") {
        setMsg("Network Error");
      } else {
        setMsg(error?.response?.data || "Login failed");
      }
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-image2 h-screen flex justify-center items-center text-4xl">
        Please Wait...
      </div>
    );
  }

  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        {isLoggedIn && auth ? (
          <section className="container px-5 py-24 mx-auto">
            <button
              className="bg-red-500 p-2 rounded-lg font-bold text-white hover:bg-red-600 duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div className="text-center mb-12">
              <div className="text-4xl font-extrabold py-2">Coop Policies</div>
              <div className="text-4xl font-extrabold py-2">
                <div className="flex flex-col justify-center items-center">
                  <ul className="space-y-4">
                    {policyData.map((item, index) => {
                      const isNewYear =
                        index === 0 || policyData[index - 1].year !== item.year;
                      return (
                        <React.Fragment key={index}>
                          {isNewYear && <li>{item.year}</li>}
                          <ListComponent
                            key={index}
                            title={item.title}
                            url={item.url}
                          />
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="container h-screen px-5 py-24 mx-auto flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-3">
              <form
                method="POST"
                className="p-5 bg-gray-900 shadow-lg rounded-xl shadow-slate-500 flex flex-col gap-2"
                onSubmit={handleSubmit}
              >
                <div className="text-white font-bold text-center text-xl py-2">
                  Login
                </div>
                <span className="text-xs text-red-400 text-center font-semibold">
                  FOR BOHECO II EMPLOYEE ONLY
                </span>
                <div className="w-full bg-gray-800 p-2 rounded-xl">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="bg-transparent border-0 w-full outline-none text-white"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                  />
                </div>
                <div className="w-full bg-gray-800 p-2 rounded-xl flex justify-between items-center">
                  <input
                    type={show ? "password" : "text"}
                    name="password"
                    placeholder="Password"
                    className="bg-transparent border-0 w-full outline-none text-white"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                  />
                  {show ? (
                    <FaEyeSlash
                      className="text-white cursor-pointer"
                      onClick={() => setShow(!show)}
                    />
                  ) : (
                    <FaEye
                      className="text-white cursor-pointer"
                      onClick={() => setShow(!show)}
                    />
                  )}
                </div>
                {msg && <span className="text-red-500">{msg}</span>}
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 p-2 rounded-md w-full"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default Policy;
