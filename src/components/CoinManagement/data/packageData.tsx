export const packageData = [
  {
    "Package": "10 Tokens",
    "Coins": 10,
    "Price": "£2.99",
    "Status": "Active"
  },
  {
    "Package": "25 Tokens",
    "Coins": 25,
    "Price": "£4.99",
    "Status": "Active"
  },
  {
    "Package": "50 Tokens",
    "Coins": 50,
    "Price": "£8.99",
    "Status": "Inactive"
  }
]

export const statusStyle: { [key: string]: string } = {
  "Active": "bg-[#DCFCE7] w-[50px] rounded-[9999px] text-[#166534] p-[1px] inter-font font-[600] text-[10.2px] leading-[20px]",
  "Inactive": "bg-[#FEE2E2] w-[60px] rounded-[9999px] text-[#991B1B] p-[1px] inter-font font-[600] text-[10.2px] leading-[20px]",
}

export const singlePckageData = packageData[0]

export type SinglePckageDataType = typeof singlePckageData

export type StatusStyleType = keyof typeof statusStyle

export const cardData = [
  {
    "title": "Total Sales",
    "value": "$47,892",
    "change": "+12.5%",
    "changeDirection": "up",
    "description": "from last month",
    "icon": <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z" fill="url(#paint0_linear_146_1797)" fillOpacity="0.1" />
      <path d="M23.8332 25.5V23.8333C23.8332 22.9493 23.482 22.1014 22.8569 21.4763C22.2317 20.8512 21.3839 20.5 20.4998 20.5H15.4998C14.6158 20.5 13.7679 20.8512 13.1428 21.4763C12.5177 22.1014 12.1665 22.9493 12.1665 23.8333V25.5" stroke="#9458E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.9998 17.1667C19.8408 17.1667 21.3332 15.6743 21.3332 13.8333C21.3332 11.9924 19.8408 10.5 17.9998 10.5C16.1589 10.5 14.6665 11.9924 14.6665 13.8333C14.6665 15.6743 16.1589 17.1667 17.9998 17.1667Z" stroke="#9458E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="paint0_linear_146_1797" x1="0" y1="18" x2="36" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9458E8" />
          <stop offset="0.5" stopColor="#A43EE7" />
          <stop offset="1" stopColor="#CA00E5" />
        </linearGradient>
      </defs>
    </svg>

  },
  {
    "title": "Most Popular",
    "value": "25 token pack",
    "secondaryValue": "560 sales this month",
    "change": null,
    "changeDirection": null,
    "description": null,
    "icon": <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z" fill="url(#paint0_linear_146_1813)" fillOpacity="0.1" />
      <path d="M24.6665 12.166H11.3332C10.4127 12.166 9.6665 12.9122 9.6665 13.8327V22.166C9.6665 23.0865 10.4127 23.8327 11.3332 23.8327H24.6665C25.587 23.8327 26.3332 23.0865 26.3332 22.166V13.8327C26.3332 12.9122 25.587 12.166 24.6665 12.166Z" stroke="#9458E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.6665 16.334H26.3332" stroke="#9458E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="paint0_linear_146_1813" x1="0" y1="18" x2="36" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9458E8" />
          <stop offset="0.5" stopColor="#A43EE7" />
          <stop offset="1" stopColor="#CA00E5" />
        </linearGradient>
      </defs>
    </svg>

  },
  {
    "title": "Avg. Purchase",
    "value": "$21.35",
    "change": "+3.2%",
    "changeDirection": "up",
    "description": "from last month",
    "icon": <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z" fill="url(#paint0_linear_146_1828)" fillOpacity="0.1" />
      <path d="M15.5 23.834V18.834C15.5 18.613 15.4122 18.401 15.2559 18.2447C15.0996 18.0884 14.8877 18.0007 14.6667 18.0007H11.3333C11.1123 18.0007 10.9004 18.0884 10.7441 18.2447C10.5878 18.401 10.5 18.613 10.5 18.834V23.834C10.5 24.055 10.5878 24.267 10.7441 24.4232C10.9004 24.5795 11.1123 24.6673 11.3333 24.6673M15.5 23.834C15.5 24.055 15.4122 24.267 15.2559 24.4232C15.0996 24.5795 14.8877 24.6673 14.6667 24.6673H11.3333M15.5 23.834C15.5 24.055 15.5878 24.267 15.7441 24.4232C15.9004 24.5795 16.1123 24.6673 16.3333 24.6673H19.6667C19.8877 24.6673 20.0996 24.5795 20.2559 24.4232C20.4122 24.267 20.5 24.055 20.5 23.834M15.5 23.834V15.5007C15.5 15.2796 15.5878 15.0677 15.7441 14.9114C15.9004 14.7551 16.1123 14.6673 16.3333 14.6673H19.6667C19.8877 14.6673 20.0996 14.7551 20.2559 14.9114C20.4122 15.0677 20.5 15.2796 20.5 15.5007V23.834M11.3333 24.6673H23M20.5 23.834C20.5 24.055 20.5878 24.267 20.7441 24.4232C20.9004 24.5795 21.1123 24.6673 21.3333 24.6673H24.6667C24.8877 24.6673 25.0996 24.5795 25.2559 24.4232C25.4122 24.267 25.5 24.055 25.5 23.834V12.1673C25.5 11.9463 25.4122 11.7343 25.2559 11.5781C25.0996 11.4218 24.8877 11.334 24.6667 11.334H21.3333C21.1123 11.334 20.9004 11.4218 20.7441 11.5781C20.5878 11.7343 20.5 11.9463 20.5 12.1673V23.834Z" stroke="#9458E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="paint0_linear_146_1828" x1="0" y1="18" x2="36" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9458E8" />
          <stop offset="0.5" stopColor="#A43EE7" />
          <stop offset="1" stopColor="#CA00E5" />
        </linearGradient>
      </defs>
    </svg>

  },
  {
    "title": "Total Coins Sold",
    "value": "1,245,780",
    "change": "+95.7%",
    "changeDirection": "up",
    "description": "from last month",
    "icon": <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z" fill="url(#paint0_linear_146_1839)" fillOpacity="0.1" />
      <path d="M19.4225 10.7442C19.2663 10.5879 19.0543 10.5 18.8333 10.5H11.3333C11.1123 10.5 10.9004 10.5878 10.7441 10.7441C10.5878 10.9004 10.5 11.1123 10.5 11.3333V18.8333C10.5 19.055 10.5875 19.2667 10.7442 19.4225L17.4108 26.0892C17.488 26.1668 17.5798 26.2284 17.681 26.2705C17.7821 26.3125 17.8905 26.3342 18 26.3342C18.1095 26.3342 18.2179 26.3125 18.319 26.2705C18.4202 26.2284 18.512 26.1668 18.5892 26.0892L26.0892 18.5892C26.2454 18.4329 26.3332 18.221 26.3332 18C26.3332 17.779 26.2454 17.5671 26.0892 17.4108L19.4225 10.7442ZM18 24.3217L12.1667 18.4883V12.1667H18.4883L24.3217 18L18 24.3217Z" fill="#9458E8" />
      <path d="M15.0799 16.3326C15.7725 16.3326 16.334 15.771 16.334 15.0784C16.334 14.3857 15.7725 13.8242 15.0799 13.8242C14.3872 13.8242 13.8257 14.3857 13.8257 15.0784C13.8257 15.771 14.3872 16.3326 15.0799 16.3326Z" fill="#9458E8" />
      <defs>
        <linearGradient id="paint0_linear_146_1839" x1="0" y1="18" x2="36" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9458E8" />
          <stop offset="0.5" stopColor="#A43EE7" />
          <stop offset="1" stopColor="#CA00E5" />
        </linearGradient>
      </defs>
    </svg>

  }
]

export type CardDataInterface = typeof cardData[0]

export const tableData = [
  {
    "user": "Jane Cooper",
    "email": "name@email.com",
    "plan": "10 Tokens",
    "buyDate": "2025-08-11"
  },
  {
    "user": "Jerome Bell",
    "email": "name@email.com",
    "plan": "25 Tokens",
    "buyDate": "2025-08-11"
  },
  {
    "user": "Ariene McCoy",
    "email": "name@email.com",
    "plan": "50 Tokens",
    "buyDate": "2025-08-11"
  },
  {
    "user": "Albert Flores",
    "email": "name@email.com",
    "plan": "10 Tokens",
    "buyDate": "2025-08-11"
  },
  {
    "user": "Jenny Wilson",
    "email": "name@email.com",
    "plan": "10 Tokens",
    "buyDate": "2025-08-11"
  },
  {
    "user": "Guy Hawkins",
    "email": "name@email.com",
    "plan": "50 Tokens",
    "buyDate": "2025-08-11"
  },
  {
    "user": "Leslie Alexander",
    "email": "name@email.com",
    "plan": "50 Tokens",
    "buyDate": "2025-08-11"
  }
]

export type TableInterface = typeof tableData[0]

export const tokenSubsriptionCondition = {
  "10 Tokens": "bg-[#DCFCE7] text-[#166534] p-[1px] rounded-[9999px] w-[80px] h-[20px] text-center",
  "25 Tokens": "bg-[#DBEAFE] text-[#1E40AF] p-[1px] rounded-[9999px] w-[80px] h-[20px] text-center",
  "50 Tokens": "bg-[#FEF9C3] text-[#854D0E] p-[1px] rounded-[9999px] w-[80px] h-[20px] text-center",
}