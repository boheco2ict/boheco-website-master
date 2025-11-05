import NoticeComponent from "../components/NoticeComponent";
import ListComponent from "../components/ListComponent";

const noticeData = [
  {
    title: "RPH-NTP-R7-Distribution-Transformers-PB-ITB-R7-1-2025",
    path: "assets/notice/RPH-NTP-R7-Distribution-Transformers-PB-ITB-R7-1-2025/RPH-NTP-R7-Distribution-Transformers-(PB-ITB-R7-1-2025)_page-0001.jpg",
    url: "https://drive.google.com/file/d/1IzOFad_MX6Wt3zfTkpPUXDc6ckE8Mm9m/view?usp=sharing",
  },
  {
    title: "RPH-NTP-R7-Steel-Poles-PB-ITB-R7-2-2025",
    path: "assets/notice/RPH-NTP-R7-Steel-Poles-PB-ITB-R7-2-2025/RPH-NTP-R7-Steel-Poles-(PB-ITB-R7-2-2025)_page-0001.jpg",
    url: "https://drive.google.com/file/d/1j63aP7sgdM1FvbIkT1TrlSMx-2Rh5jtw/view?usp=sharing",
  },
  {
    title: "RPH-NTP-R7-Conductors-PB-ITB-R7-3-2025",
    path: "assets/notice/RPH-NTP-R7-Conductors-PB-ITB-R7-3-2025/RPH-NTP-R7-Conductors-(PB-ITB-R7-3-2025)_page-0001.jpg",
    url: "https://drive.google.com/file/d/16WyC0r43awv3EOYgNtpThb7KXucW9xXw/view?usp=sharing",
  },
  {
    title: "RPH NOA - R7 Conductors (PB-ITB-R7-3-2025)",
    path: "assets/notice/RPH NOA - R7 Conductors (PB-ITB-R7-3-2025)/RPH NOA - R7 Conductors (PB-ITB-R7-3-2025)_page-0001.jpg",
    url: "https://drive.google.com/file/d/1Zv0Uf7uZ9jvBw6h4b4wvI5kI5b6H6h5t/view?usp=drive_link",
  },
  {
    title: "RPH NOA - R7 Steel Poles (PB-ITB-R7-2-2025)",
    path: "assets/notice/RPH NOA - R7 Steel Poles (PB-ITB-R7-2-2025)/RPH NOA - R7 Steel Poles (PB-ITB-R7-2-2025)_page-0001.jpg",
    url: "https://drive.google.com/file/d/1k_f2j561feTXKtNNVCiKZoCN5Y7Hmcb9/view?usp=drive_link",
  },
  {
    title: "RPH NOA - R7 Distribution Transformers (PB-ITB-R7-1-2025)",
    path: "assets/notice/RPH NOA - R7 Distribution Transformers (PB-ITB-R7-1-2025)/RPH NOA - R7 Distribution Transformers (PB-ITB-R7-1-2025)_page-0001.jpg",
    url: "https://drive.google.com/file/d/1pAWI8tG7HQv8L8n5OTjtSN2ws8a4tsMn/view?usp=drive_link",
  },
  {
    title: "PROCUREMENT OF SUPPLY AND DELIVERY OF STEEL POLES",
    path: "assets/notice/PROCUREMENT-OF-SUPPLY-AND-DELIVERY-OF-STEEL-POLES_page-0001.jpg",
    url: "https://drive.google.com/file/d/14E2Th73jZ57rK0lrZ0jEFHM9dzlo4EsT/view?usp=sharing",
  },
  {
    title: "PROCUREMENT OF SUPPLY AND DELIVERY OF CONDUCTORS",
    path: "assets/notice/PROCUREMENT-OF-SUPPLY-AND-DELIVERY-OF-CONDUCTORS_page-0001.jpg",
    url: "https://drive.google.com/file/d/1B3meiu8pKX86zEWZ-kQja2lkx5u8ha4e/view?usp=drive_link",
  },
  {
    title:
      "PROCUREMENT OF CONSIGNMENT SUPPLY AND DELIVERY OF DISTRIBUTION TRANSFORMERS",
    path: "assets/notice/PROCUREMENT-OF-CONSIGNMENT-SUPPLY-AND-DELIVERY-OF-DISTRIBUTION-TRANSFORMERS_page-0001.jpg",
    url: "https://drive.google.com/file/d/1Avy6LYOUmjAHjwpdaLG1I7lP4cIzjnUh/view?usp=sharing",
  },
  {
    title: "PB-ITB-R7-1-2025",
    path: "assets/notice/PB-ITB-R7-1-2025/PB-ITB-R7-1-2025_page-0001.jpg",
    url: "https://drive.google.com/file/d/1QauvDKMExDlzyHbEhOhxG8NliK8NcKej/view?usp=drive_link",
  },
  {
    title: "PB-ITB-R7-2-2025",
    path: "assets/notice/PB-ITB-R7-2-2025/PB-ITB-R7-2-2025_page-0001.jpg",
    url: "https://drive.google.com/file/d/1-p-0XqazTO9Yqbz-PAaQF7KNflCcZbb9/view?usp=drive_link",
  },
  {
    title: "PB-ITB-R7-3-2025",
    path: "assets/notice/PB-ITB-R7-3-2025/PB-ITB-R7-3-2025_page-0001.jpg",
    url: "https://drive.google.com/file/d/1D9KXNP-IKGNmyWsW1_XpY67OwZuacJQC/view?usp=drive_link",
  },
  {
    title: "NOTICE OF VIRTUAL HEARING",
    path: "assets/notice/Promulgated 0125-2024. NVH 2024-029 CF 26Dec2024_page-0001.jpg",
    url: "https://drive.google.com/file/d/1xU4C-LvoVZEIUzrsYYxbnsYb1fBfXU42/view?usp=drive_link",
  },
  {
    title: "Notice Of Award",
    path: "assets/notice/Signed NOA - PB-ITB-R7-2-2024 (Rebidding)_page-0001.jpg",
    url: "https://drive.google.com/file/d/1CCtSZz9IbbQ6KF4yJ2dTX0MBaHz0Y_cE/view?usp=drive_link",
  },
];

function Notice() {
  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        <section className="container px-5 py-24 mx-auto">
          <div className="text-center mb-12">
            <div className="text-4xl font-extrabold py-2">
              <div className="flex flex-col justify-center items-center">
                <ul className="space-y-4">
                  {noticeData.map((item, index) => (
                    <li key={index}>
                      <NoticeComponent title={item.title} path={item.path} />
                      <ListComponent title={item.title} url={item.url} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Notice;
