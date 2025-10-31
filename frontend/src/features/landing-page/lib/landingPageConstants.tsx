import type { TFunction } from "i18next";

export const getNavigation = (t: TFunction) => [
  {
    title: t("random.aboutYou"),
    href: "#",
    isExtandable: false,
  },
  {
    title: t("random.services"),
    href: "#",
    isExtandable: true,
  },
  {
    title: t("random.functionalities"),
    href: "#",
    isExtandable: true,
  },
];

interface Stat {
  title: string;
  description: string;
  icon: React.ComponentType;
}

export const STATS: Stat[] = [
  {
    title: "500+",
    description: "Verified Professionals",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
        className="h-5 w-5 text-white"
      >
        <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Z" />
      </svg>
    ),
  },
  {
    title: "10k+",
    description: "Patients Served",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
        className="h-5 w-5 text-white"
      >
        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
      </svg>
    ),
  },
  {
    title: "24/7",
    description: "Available Support",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="h-5 w-5 text-white"
      >
        <path d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
      </svg>
    ),
  },
  {
    title: "4.9",
    description: "Average Rating",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="h-5 w-5 text-white"
      >
        <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
      </svg>
    ),
  },
];

interface Service {
  title: string;
  description: string;
  icon: React.ComponentType;
  href: string;
}

export const SERVICES: Service[] = [
  {
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="h-5 w-5 text-white"
      >
        <path d="M192 108.9C192 96.2 199.5 84.7 211.2 79.6L307.2 37.6C315.4 34 324.7 34 332.9 37.6L428.9 79.6C440.5 84.7 448 96.2 448 108.9L448 208C448 278.7 390.7 336 320 336C249.3 336 192 278.7 192 208L192 108.9zM400 192L288.4 192L288 192L240 192L240 208C240 252.2 275.8 288 320 288C364.2 288 400 252.2 400 208L400 192zM304 80L304 96L288 96C283.6 96 280 99.6 280 104L280 120C280 124.4 283.6 128 288 128L304 128L304 144C304 148.4 307.6 152 312 152L328 152C332.4 152 336 148.4 336 144L336 128L352 128C356.4 128 360 124.4 360 120L360 104C360 99.6 356.4 96 352 96L336 96L336 80C336 75.6 332.4 72 328 72L312 72C307.6 72 304 75.6 304 80zM238.6 387C232.1 382.1 223.4 380.8 216 384.2C154.6 412.4 111.9 474.4 111.9 546.3C111.9 562.7 125.2 576 141.6 576L498.2 576C514.6 576 527.9 562.7 527.9 546.3C527.9 474.3 485.2 412.3 423.8 384.2C416.4 380.8 407.7 382.1 401.2 387L334.2 437.2C325.7 443.6 313.9 443.6 305.4 437.2L238.4 387z" />
      </svg>
    ),
    title: "Nursing Care",
    description:
      "Professional nursing services including wound care, medication administration, and health monitoring.",
    href: "#",
  },
  {
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
        className="h-5 w-5 text-white"
      >
        <path d="M481-276ZM120-160v-160q0-83 58.5-141.5T320-520h429q38 0 64.5 26t26.5 64q0 31-19 55.5T773-342l-93 27v155q0 21-9.5 38T645-94q-16 11-35 13.5T571-86l-189-74H120Zm480-120H375q-7 0-10.5 4t-4.5 9q-1 5 1.5 9.5t8.5 6.5l230 91v-120Zm-400 40h84q-2-6-3-12t-1-13q0-39 28-67t67-28h163l214-59q5-2 7-5t1-7q-1-4-3.5-6.5T749-440H320q-50 0-85 35t-35 85v80Zm200-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T480-720q0-33-23.5-56.5T400-800q-33 0-56.5 23.5T320-720q0 33 23.5 56.5T400-640Zm81 364Zm-81-444Z" />
      </svg>
    ),
    title: "Physiotherapy",
    description:
      "Rehabilitation and physical therapy services to help you recover and maintain mobility.",
    href: "#",
  },
  {
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
        className="h-5 w-5 text-white"
      >
        <path d="m320-40-64-48 104-139v-213q0-31 5-67.5t15-67.5l-60 33v142h-80v-188l176-100q25-14 43.5-21.5T494-717q25 0 45.5 21.5T587-628q32 54 58 81t56 41q11-8 19-11t19-3q25 0 43 18t18 42v420h-40v-420q0-8-6-14t-14-6q-8 0-14 6t-6 14v50h-40v-19q-54-23-84-51.5T543-557q-11 28-17.5 68.5T521-412l79 112v260h-80v-200l-71-102-9 142L320-40Zm220-700q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z" />
      </svg>
    ),
    title: "Personal Care",
    description:
      "Compassionate caregiving services for elderly and patients with special needs.",
    href: "#",
  },
];

interface Step {
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    title: "Request Care",
    description:
      "Tell us what type of care you need and when. Our smart system will find the right professional for you.",
  },
  {
    title: "Get Matched",
    description:
      "We instantly match you with verified healthcare professionals in your area based on availability and expertise.",
  },
  {
    title: "Receive Care",
    description:
      "Your healthcare professional arrives at your location to provide quality care. Pay securely through the app.",
  },
];

interface Review {
  profilePictureUrl: string;
  name: string;
  numberOfStars: number;
  reviewText: string;
}

export const REVIEWS: Review[] = [
  {
    profilePictureUrl:
      "https://img.freepik.com/premium-photo/real-professional-smiling-businesswoman-looking-confident-determined-face-expression-standing-sui_1258-88420.jpg",
    name: "Sarah M.",
    numberOfStars: 5,
    reviewText:
      "Wi-Help made it so easy to get nursing care for my elderly mother. The nurse was professional, caring, and arrived exactly on time.",
  },
  {
    profilePictureUrl:
      "https://img.lb.wbmdstatic.com/lhd/provider/3975497_655fa787-ece5-4c0b-b979-7d775b35e28a.jpg",
    name: "Ahmed K.",
    numberOfStars: 4,
    reviewText:
      "The physiotherapy sessions at home helped me recover much faster. The app made booking and payment seamless.",
  },
  {
    profilePictureUrl:
      "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80",
    name: "Fatima B.",
    numberOfStars: 5,
    reviewText:
      "Excellent service! The caregiver was compassionate and professional. Wi-Help truly understands patient needs.",
  },
  {
    profilePictureUrl:
      "https://www.mountain.commonspirit.org/sites/default/files/styles/profile_image/https/embed.widencdn.net/img/csdam/ya4rnqreap/exact/Photo_Vollmer_Jeremy_DO_SAH.png?h=2c61325d",
    name: "Mohamed C.",
    numberOfStars: 4,
    reviewText:
      "The home care services were outstanding. The staff was punctual and very attentive to my needs. Highly recommend Wi-Help!",
  },
];
