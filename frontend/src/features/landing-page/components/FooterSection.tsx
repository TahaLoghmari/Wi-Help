import Icon2 from "@/assets/Icon-2.png";

export function FooterSection() {
  return (
    <div className="my-10">
      <div className="grid grid-cols-4 border-b-2 border-gray-400/20 pb-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <img src={Icon2} alt="Logo" className="h-10" />
            <div className="flex flex-col">
              <p className="text-xl font-bold text-white">Wi Help</p>
              <p className="text-accent text-xs">
                taking care of others is our priority
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
              fill="currentColor"
              className="h-5 w-5 cursor-pointer text-[#5ed0ab] hover:text-[#5ed0ab]/80"
            >
              <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
            </svg>
            <svg
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="h-5 w-5 cursor-pointer text-[#5ed0ab] hover:text-[#5ed0ab]/80"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <rect x="0" fill="none" width="20" height="20"></rect>{" "}
                <g>
                  {" "}
                  <path d="M12.7 10c0-1.5-1.2-2.7-2.7-2.7S7.3 8.5 7.3 10s1.2 2.7 2.7 2.7c1.5 0 2.7-1.2 2.7-2.7zm1.4 0c0 2.3-1.8 4.1-4.1 4.1S5.9 12.3 5.9 10 7.7 5.9 10 5.9s4.1 1.8 4.1 4.1zm1.1-4.3c0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .5 1 1zM10 3.4c-1.2 0-3.7-.1-4.7.3-.7.3-1.3.9-1.5 1.6-.4 1-.3 3.5-.3 4.7s-.1 3.7.3 4.7c.2.7.8 1.3 1.5 1.5 1 .4 3.6.3 4.7.3s3.7.1 4.7-.3c.7-.3 1.2-.8 1.5-1.5.4-1.1.3-3.6.3-4.7s.1-3.7-.3-4.7c-.2-.7-.8-1.3-1.5-1.5-1-.5-3.5-.4-4.7-.4zm8 6.6v3.3c0 1.2-.4 2.4-1.3 3.4-.9.9-2.1 1.3-3.4 1.3H6.7c-1.2 0-2.4-.4-3.4-1.3-.8-.9-1.3-2.1-1.3-3.4V10 6.7c0-1.3.5-2.5 1.3-3.4C4.3 2.5 5.5 2 6.7 2h6.6c1.2 0 2.4.4 3.4 1.3.8.9 1.3 2.1 1.3 3.4V10z"></path>{" "}
                </g>{" "}
              </g>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
              fill="currentColor"
              className="h-5 w-5 cursor-pointer text-[#5ed0ab] hover:text-[#5ed0ab]/80"
            >
              <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-white">Services</p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Nursing Care
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Physiotherapy
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Personal Care
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Emergency Care
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-white">Company</p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            About Us
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Careers
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Press
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Contact
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-white">Support</p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Help Center
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Safety
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Privacy Policy
          </p>
          <p className="cursor-pointer text-gray-300 hover:text-[#5ed0ab]">
            Terms of Service
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-white">
          © 2024 Wi-Help. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-white">Available on:</p>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
              fill="currentColor"
              className="h-4 w-4 text-white"
            >
              <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
              fill="currentColor"
              className="h-4 w-4 text-white"
            >
              <path d="M 7.125 2 L 28.78125 23.5 L 34.71875 17.5625 L 8.46875 2.40625 C 8.03125 2.152344 7.5625 2.011719 7.125 2 Z M 5.3125 3 C 5.117188 3.347656 5 3.757813 5 4.21875 L 5 46 C 5 46.335938 5.070313 46.636719 5.1875 46.90625 L 27.34375 24.90625 Z M 36.53125 18.59375 L 30.1875 24.90625 L 36.53125 31.1875 L 44.28125 26.75 C 45.382813 26.113281 45.539063 25.304688 45.53125 24.875 C 45.519531 24.164063 45.070313 23.5 44.3125 23.09375 C 43.652344 22.738281 38.75 19.882813 36.53125 18.59375 Z M 28.78125 26.3125 L 6.9375 47.96875 C 7.300781 47.949219 7.695313 47.871094 8.0625 47.65625 C 8.917969 47.160156 26.21875 37.15625 26.21875 37.15625 L 34.75 32.25 Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
