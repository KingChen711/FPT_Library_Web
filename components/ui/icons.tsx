/* eslint-disable tailwindcss/no-custom-classname */
import { cn } from "@/lib/utils"

export type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  Loader: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Google: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 128 128"
      className={cn(className)}
      {...props}
    >
      <path
        fill="#fff"
        d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38z"
      ></path>
      <path
        fill="#e33629"
        d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21z"
      ></path>
      <path
        fill="#f8bd00"
        d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9z"
      ></path>
      <path
        fill="#587dbd"
        d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"
      ></path>
      <path
        fill="#319f43"
        d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4z"
      ></path>
    </svg>
  ),
  Dashboard: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"
      ></path>
    </svg>
  ),
  Supplier: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      {...props}
      className={cn(className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path d="m20 33l6 2s15-3 17-3s2 2 0 4s-9 8-15 8s-10-3-14-3H4"></path>
        <path d="M4 29c2-2 6-5 10-5s13.5 4 15 6s-3 5-3 5M16 18v-8a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v16"></path>
        <path d="M25 8h10v9H25z"></path>
      </g>
    </svg>
  ),
  Tracking: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
      className={cn(className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 .5v4M8.5 11H11M.5 4.5h13v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-8h0Z"></path>
        <path d="M.5 4.5L2 1.61A2 2 0 0 1 3.74.5h6.52a2 2 0 0 1 1.79 1.11L13.5 4.5"></path>
      </g>
    </svg>
  ),
  Wand: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 21L21 6l-3-3L3 18l3 3m9-15l3 3M9 3a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2m10 10a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"
      ></path>
    </svg>
  ),
  Warehouse: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 640 512"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0l267.9 107.1c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24h-48c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32v264c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24H152c-13.3 0-24-10.7-24-24v-56h384v56c0 13.3-10.7 24-24 24zM128 400v-64h384v64H128zm0-96v-80h384v80H128z"
      ></path>
    </svg>
  ),
  Home: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.38 1.353L8 1.131l-.38.222l-7.25 4.25a.75.75 0 0 0 .76 1.294l.87-.51V14h12V6.387l.87.51a.75.75 0 1 0 .76-1.294l-7.25-4.25Zm4.12 4.154L8 2.87L3.5 5.507V12.5H6V8h4v4.5h2.5V5.507ZM8.5 9.5v3h-1v-3h1Z"
        clipRule="evenodd"
      ></path>
    </svg>
  ),

  Publish: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M9.967 8.193L5 13h3v6h4v-6h3L9.967 8.193zM18 1H2C.9 1 0 1.9 0 3v12c0 1.1.9 2 2 2h4v-2H2V6h16v9h-4v2h4c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM2.5 4.25a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5zm2 0a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5zM18 4H6V3h12.019L18 4z"
      ></path>
    </svg>
  ),
  Draft: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M10.27 2.001a2.621 2.621 0 0 1 3.712 3.702l-7.469 7.491a1.5 1.5 0 0 1-.558.354l-3.969 1.416a.75.75 0 0 1-.958-.96l1.426-3.963a1.5 1.5 0 0 1 .349-.551l7.467-7.489Zm3.002.704a1.621 1.621 0 0 0-2.294.002l-.782.784l2.293 2.293l.785-.787a1.621 1.621 0 0 0-.002-2.292Zm-1.489 3.787L9.49 4.199l-5.979 5.997a.5.5 0 0 0-.116.184l-1.247 3.464l3.47-1.238a.5.5 0 0 0 .187-.118l5.978-5.996ZM8.857 2H1.5a.5.5 0 1 0 0 1h6.36l.997-1ZM6.863 4H1.5a.5.5 0 1 0 0 1h4.366l.997-1ZM4.87 6H1.5a.5.5 0 1 0 0 1h2.373l.997-1Z"
      ></path>
    </svg>
  ),
  Category: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M6.5 11L12 2l5.5 9h-11Zm11 11q-1.875 0-3.188-1.313T13 17.5q0-1.875 1.313-3.188T17.5 13q1.875 0 3.188 1.313T22 17.5q0 1.875-1.313 3.188T17.5 22ZM3 21.5v-8h8v8H3Z"
      ></path>
    </svg>
  ),
  Resource: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="m12 3l9 4.5l-9 4.5l-9-4.5L12 3Zm4.5 7.25L21 12.5L12 17l-9-4.5l4.5-2.25m9 5L21 17.5L12 22l-9-4.5l4.5-2.25"
      ></path>
    </svg>
  ),
  Return: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.545.998a1 1 0 0 0 0 2h2.728a2.638 2.638 0 0 1 0 5.275H4.817V6.545a1 1 0 0 0-1.707-.707L.384 8.564a1.004 1.004 0 0 0-.22 1.09c.049.119.121.23.218.327l2.728 2.728a1 1 0 0 0 1.707-.707v-1.729h4.456a4.638 4.638 0 1 0 0-9.275z"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  Search: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53Zm0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6Z"
      ></path>
      <path
        fill="currentColor"
        d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22Z"
      ></path>
    </svg>
  ),

  Bell: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M13.377 10.573a7.63 7.63 0 0 1-.383-2.38V6.195a5.115 5.115 0 0 0-1.268-3.446a5.138 5.138 0 0 0-3.242-1.722c-.694-.072-1.4 0-2.07.227c-.67.215-1.28.574-1.794 1.053a4.923 4.923 0 0 0-1.208 1.675a5.067 5.067 0 0 0-.431 2.022v2.2a7.61 7.61 0 0 1-.383 2.37L2 12.343l.479.658h3.505c0 .526.215 1.04.586 1.412c.37.37.885.586 1.412.586c.526 0 1.04-.215 1.411-.586s.587-.886.587-1.412h3.505l.478-.658l-.586-1.77zm-4.69 3.147a.997.997 0 0 1-.705.299a.997.997 0 0 1-.706-.3a.997.997 0 0 1-.3-.705h1.999a.939.939 0 0 1-.287.706zm-5.515-1.71l.371-1.114a8.633 8.633 0 0 0 .443-2.691V6.004c0-.563.12-1.113.347-1.616c.227-.514.55-.969.969-1.34c.419-.382.91-.67 1.436-.837c.538-.18 1.1-.24 1.65-.18a4.147 4.147 0 0 1 2.597 1.4a4.133 4.133 0 0 1 1.004 2.776v2.01c0 .909.144 1.818.443 2.691l.371 1.113h-9.63v-.012z"
      ></path>
    </svg>
  ),

  Shelf: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M3 23V1h2v2h14V1h2v22h-2v-2H5v2H3Zm2-12h2V7h6v4h6V5H5v6Zm0 8h6v-4h6v4h2v-6H5v6Zm4-8h2V9H9v2Zm4 8h2v-2h-2v2Zm-4-8h2h-2Zm4 8h2h-2Z"
      ></path>
    </svg>
  ),

  Robot: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.706 4.313H9.294a4.982 4.982 0 0 0-4.982 4.981v5.412a4.982 4.982 0 0 0 4.982 4.982h5.412a4.982 4.982 0 0 0 4.982-4.982V9.294a4.982 4.982 0 0 0-4.982-4.982Z"></path>
        <path d="M19.606 15.588h1.619a1.025 1.025 0 0 0 1.025-1.025V9.438a1.025 1.025 0 0 0-1.025-1.025h-1.62m-15.21 7.175h-1.62a1.025 1.025 0 0 1-1.025-1.025V9.438a1.025 1.025 0 0 1 1.025-1.025h1.62"></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.765 8.413v-4.1m18.46 4.1l-.01-4.1M9.95 15.237a2.91 2.91 0 0 0 4.1 0m-6.17-4.262L8.903 9.95l1.025 1.025m4.102 0l1.025-1.025l1.024 1.025"
        ></path>
      </g>
    </svg>
  ),

  Author: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512.000000pt"
      height="512.000000pt"
      viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet"
      {...props}
      className={cn(className)}
    >
      <g
        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="none"
      >
        <path
          fill="currentColor"
          d="M2805 4786 c-69 -13 -218 -65 -365 -126 -41 -18 -103 -36 -138 -41 -150 -22 -240 -119 -279 -302 -18 -88 -13 -279 12 -409 l17 -86 31 9 c18 5 51 9 74 9 l42 0 36 76 c62 130 77 205 82 413 7 240 0 231 175 231 202 0 288 -33 453 -174 53 -45 123 -104 157 -133 107 -92 113 -93 378 -93 l231 0 24 -25 c24 -23 25 -29 25 -160 0 -108 3 -135 14 -135 32 0 29 224 -5 355 -72 281 -292 497 -589 576 -97 26 -280 33 -375 15z"
        />
        <path
          fill="currentColor"
          d="M2480 4312 c0 -129 -16 -233 -54 -342 -18 -52 -36 -103 -40 -112 -8 -17 4 -18 170 -18 192 0 234 -9 278 -59 17 -19 29 -21 126 -21 96 0 109 2 126 21 10 12 36 30 56 40 33 17 61 19 248 19 l210 0 0 79 0 79 -198 4 -198 3 -75 37 c-46 23 -110 68 -168 120 -156 137 -192 166 -256 200 -50 26 -74 33 -142 36 l-83 5 0 -91z"
        />
        <path
          fill="currentColor"
          d="M782 4111 c2 -5 50 -123 108 -262 l105 -252 41 -17 c138 -60 138 -243 -1 -295 -50 -20 -93 -15 -143 15 -66 40 -92 132 -57 201 16 29 14 35 -97 299 -72 171 -115 263 -119 252 -3 -9 -34 -123 -69 -253 l-63 -236 259 -344 c143 -189 264 -350 270 -358 10 -13 34 -7 181 52 l170 68 -38 252 c-20 139 -49 336 -65 440 l-28 187 -223 130 c-123 72 -226 130 -229 130 -3 0 -4 -4 -2 -9z"
        />
        <path
          fill="currentColor"
          d="M2095 3666 c-124 -54 -123 -240 2 -292 64 -27 63 -31 63 146 0 177 1 175 -65 146z"
        />
        <path
          fill="currentColor"
          d="M2324 3667 c-3 -8 -4 -43 -2 -78 l3 -64 195 0 195 0 0 75 0 75 -193 3 c-156 2 -193 0 -198 -11z"
        />
        <path
          fill="currentColor"
          d="M3204 3667 c-3 -8 -4 -43 -2 -78 l3 -64 195 0 195 0 0 75 0 75 -193 3 c-156 2 -193 0 -198 -11z"
        />
        <path
          fill="currentColor"
          d="M3760 3520 l0 -162 33 6 c38 7 73 31 101 70 29 39 29 133 0 172 -28 39 -63 63 -101 70 l-33 7 0 -163z"
        />
        <path
          fill="currentColor"
          d="M2880 3555 c0 -83 -37 -145 -105 -176 -35 -16 -68 -19 -249 -19 l-209 0 6 -147 c3 -90 12 -171 22 -208 70 -252 264 -460 477 -510 131 -31 282 -13 400 46 114 58 245 203 308 343 47 104 61 171 67 329 l6 147 -207 0 c-215 0 -253 6 -299 48 -33 30 -57 89 -57 142 l0 50 -80 0 -80 0 0 -45z m394 -540 c3 -16 8 -51 11 -77 l7 -46 -64 -7 c-77 -8 -584 -3 -593 7 -4 3 -1 39 5 80 l12 73 308 0 309 0 5 -30z"
        />
        <path
          fill="currentColor"
          d="M1255 2765 c-154 -63 -284 -116 -290 -118 -10 -4 43 -147 54 -147 18 -1 601 237 601 245 0 6 -12 38 -26 73 -18 40 -33 62 -43 61 -9 0 -142 -52 -296 -114z"
        />
        <path
          fill="currentColor"
          d="M1375 2468 c-165 -67 -301 -122 -303 -123 -9 -7 162 -564 233 -757 44 -118 49 -128 73 -128 37 0 152 21 152 28 0 3 -25 72 -56 154 -31 82 -55 150 -53 152 2 1 36 14 75 29 l72 26 46 -125 c83 -221 78 -213 123 -207 35 5 66 -8 278 -114 219 -110 295 -143 295 -128 0 13 -104 276 -175 440 -145 340 -415 868 -446 872 -7 1 -149 -53 -314 -119z m116 -389 c12 -39 18 -74 13 -78 -8 -7 -125 -51 -136 -51 -6 0 -53 149 -47 153 5 4 131 45 141 46 4 1 17 -31 29 -70z"
        />
        <path
          fill="currentColor"
          d="M2640 2342 c0 -68 -16 -115 -57 -169 l-36 -47 62 -58 c213 -200 547 -193 750 16 l34 35 -32 27 c-47 39 -73 99 -79 176 l-5 66 -43 -18 c-150 -65 -399 -64 -549 0 l-45 19 0 -47z"
        />
        <path
          fill="currentColor"
          d="M2255 2065 c-49 -7 -91 -14 -92 -14 -1 -1 16 -40 38 -88 57 -122 186 -433 243 -583 l47 -126 247 -22 247 -23 335 34 336 35 244 122 245 123 195 -32 c107 -17 201 -31 209 -31 11 0 13 23 9 118 -4 106 -7 124 -35 185 -50 106 -154 196 -258 222 -16 4 -181 26 -365 50 l-335 43 -40 -46 c-94 -111 -185 -179 -300 -223 -282 -110 -611 -21 -793 213 -50 64 -41 62 -177 43z"
        />
        <path
          fill="currentColor"
          d="M1555 1324 c-104 -18 -191 -33 -192 -33 -2 -1 -3 -103 -3 -227 0 -177 3 -225 13 -221 6 3 76 31 155 62 l144 58 296 -56 297 -56 835 -266 835 -266 262 3 c246 3 263 4 289 24 68 51 69 52 72 310 2 129 -1 234 -5 234 -4 0 -532 52 -1173 116 l-1165 116 -235 118 -235 117 -190 -33z"
        />
        <path
          fill="currentColor"
          d="M3949 1244 c-123 -62 -219 -113 -212 -113 6 -1 191 -19 412 -41 220 -22 403 -40 406 -40 3 0 5 54 5 119 0 105 -2 120 -17 125 -14 4 -250 44 -349 59 -12 2 -118 -45 -245 -109z"
        />
        <path
          fill="currentColor"
          d="M1523 732 l-163 -66 0 -108 c0 -127 11 -163 66 -204 l37 -29 261 -3 260 -3 353 112 c195 62 348 116 341 119 -7 4 -114 39 -238 78 -217 68 -246 75 -735 166 -11 2 -93 -26 -182 -62z"
        />
        <path
          fill="currentColor"
          d="M2860 431 l-85 -27 3 -35 c1 -18 6 -37 11 -42 4 -4 141 -6 304 -5 l298 3 -214 68 c-117 37 -217 67 -222 66 -6 -1 -48 -13 -95 -28z"
        />
        <path
          fill="currentColor"
          d="M2560 335 l-35 -13 48 -1 c35 -1 47 3 47 14 0 18 -13 18 -60 0z"
        />
      </g>
    </svg>
  ),
  Facebook: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
      className={cn(className)}
    >
      <path
        fill="#1877F2"
        d="M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.307 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.347-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.958 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
      ></path>
      <path
        fill="#FFF"
        d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A128.959 128.959 0 0 0 128 256a128.9 128.9 0 0 0 20-1.555V165h29.825"
      ></path>
    </svg>
  ),

  User: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="M8 24v-5m8 5v-5M3 24v-5c0-4.97 4.03-8 9-8s9 3.03 9 8v5m-9-13a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z"
      ></path>
    </svg>
  ),

  Male: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1760"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M1024 672v416q0 40-28 68t-68 28t-68-28t-28-68V736h-64v912q0 46-33 79t-79 33t-79-33t-33-79v-464h-64v464q0 46-33 79t-79 33t-79-33t-33-79V736h-64v352q0 40-28 68t-68 28t-68-28t-28-68V672q0-80 56-136t136-56h640q80 0 136 56t56 136zM736 224q0 93-65.5 158.5T512 448t-158.5-65.5T288 224t65.5-158.5T512 0t158.5 65.5T736 224z"
      ></path>
    </svg>
  ),
  Female: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 512"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M128 0c35.346 0 64 28.654 64 64s-28.654 64-64 64c-35.346 0-64-28.654-64-64S92.654 0 128 0m119.283 354.179l-48-192A24 24 0 0 0 176 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H80a24 24 0 0 0-23.283 18.179l-48 192C4.935 369.305 16.383 384 32 384h56v104c0 13.255 10.745 24 24 24h32c13.255 0 24-10.745 24-24V384h56c15.591 0 27.071-14.671 23.283-29.821z"
      ></path>
    </svg>
  ),
  SystemConfiguration: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M1 2h22v8.25h-2V4H3v12h8.5v2H1V2Zm2 18h8.5v2H3v-2Z"
      ></path>
      <path
        fill="currentColor"
        d="M19.5 12v1.376c.715.184 1.352.56 1.854 1.072l1.193-.689l1 1.732l-1.192.688a4.008 4.008 0 0 1 0 2.142l1.192.688l-1 1.732l-1.193-.689a4 4 0 0 1-1.854 1.072V22.5h-2v-1.376a3.996 3.996 0 0 1-1.854-1.072l-1.193.689l-1-1.732l1.192-.688a4.004 4.004 0 0 1 0-2.142l-1.192-.688l1-1.732l1.193.688a3.996 3.996 0 0 1 1.854-1.071V12h2Zm-2.751 4.283a1.991 1.991 0 0 0-.25.967c0 .35.091.68.25.967l.036.063a1.999 1.999 0 0 0 3.43 0l.036-.063c.159-.287.249-.616.249-.967c0-.35-.09-.68-.249-.967l-.036-.063a1.999 1.999 0 0 0-3.43 0l-.036.063Z"
      ></path>
    </svg>
  ),
  Users: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 36 36"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
        className="clr-i-solid clr-i-solid-path-1"
      ></path>
      <path
        fill="currentColor"
        d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
        className="clr-i-solid clr-i-solid-path-2"
      ></path>
      <path
        fill="currentColor"
        d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
        className="clr-i-solid clr-i-solid-path-3"
      ></path>
      <path
        fill="currentColor"
        d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
        className="clr-i-solid clr-i-solid-path-4"
      ></path>
      <circle
        cx="17.87"
        cy="13.45"
        r="4.47"
        fill="currentColor"
        className="clr-i-solid clr-i-solid-path-5"
      ></circle>
      <path
        fill="currentColor"
        d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
        className="clr-i-solid clr-i-solid-path-6"
      ></path>
      <path fill="none" d="M0 0h36v36H0z"></path>
    </svg>
  ),
  Role: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M15 21h-2a2 2 0 0 1 0-4h2v-2h-2a4 4 0 0 0 0 8h2Zm8-2a4 4 0 0 1-4 4h-2v-2h2a2 2 0 0 0 0-4h-2v-2h2a4 4 0 0 1 4 4Z"
      ></path>
      <path
        fill="currentColor"
        d="M14 18h4v2h-4zm-7 1a5.989 5.989 0 0 1 .09-1H3v-1.4c0-2 4-3.1 6-3.1a8.548 8.548 0 0 1 1.35.125A5.954 5.954 0 0 1 13 13h5V4a2.006 2.006 0 0 0-2-2h-4.18a2.988 2.988 0 0 0-5.64 0H2a2.006 2.006 0 0 0-2 2v14a2.006 2.006 0 0 0 2 2h5.09A5.989 5.989 0 0 1 7 19ZM9 2a1 1 0 1 1-1 1a1.003 1.003 0 0 1 1-1Zm0 4a3 3 0 1 1-3 3a2.996 2.996 0 0 1 3-3Z"
      ></path>
    </svg>
  ),
  Key: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="m13.815 14.632l-4.031 4.031H7.115v2.668H4.447v2.668H0v-4.447l9.368-9.368a7.41 7.41 0 0 1-.474-2.632a7.554 7.554 0 1 1 4.869 7.062l.052.017zm7.532-9.31v-.003a2.668 2.668 0 1 0-2.669 2.668h.001a2.669 2.669 0 0 0 2.668-2.665z"
      ></path>
    </svg>
  ),
  Lock: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 42 42"
      {...props}
      className={cn(className)}
    >
      <path
        fill="none"
        d="M23.68 28.484c0-1.76-1.42-3.18-3.18-3.18s-3.18 1.42-3.18 3.18c0 1.412.91 2.6 2.17 3.02l-1.99 4.98h6l-1.99-4.98a3.178 3.178 0 0 0 2.17-3.02z"
      ></path>
      <path
        fill="currentColor"
        d="M20.5 6.411c5.98 0 8.67 5.073 9 10.073h5c-.09-9-4.67-14.903-14-14.983c-9.27-.09-14 6.983-14 14.983h4.969c.26-5 2.831-10.073 9.031-10.073zm14 12.089h-28c-2.41 0-3 .655-3 2.984v17c0 2.49.561 3 3 3h28c2.609 0 3-.471 3-3v-17c0-2.458-.46-2.984-3-2.984zm-11 17.984h-6l1.99-4.98a3.176 3.176 0 0 1-2.17-3.02c0-1.76 1.42-3.18 3.18-3.18s3.18 1.42 3.18 3.18c0 1.41-.91 2.6-2.17 3.02l1.99 4.98z"
      ></path>
    </svg>
  ),
  SystemHealth: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 2048 2048"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M1504 128q113 0 212 42t172 116t116 173t43 212q0 58-12 115t-36 110h-463l-192-200l-320 320l-448-448l-320 328H49q-24-53-36-110T1 671q0-113 42-212t116-172t173-116t212-43q109 0 208 41t177 118l95 96l95-96q77-77 176-118t209-41zm-96 896h510l-14 16q-7 8-15 17l-865 864l-865-864q-8-8-15-16t-14-17h254l192-184l448 448l320-320l64 56z"
      ></path>
    </svg>
  ),
  Employees: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 36 36"
      {...props}
      className={cn(className)}
    >
      <g id="clarityEmployeeGroupSolid0" fill="currentColor">
        <ellipse cx="18" cy="11.28" rx="4.76" ry="4.7"></ellipse>
        <path d="M10.78 11.75h.48v-.43a6.7 6.7 0 0 1 3.75-6a4.62 4.62 0 1 0-4.21 6.46Zm13.98-.47v.43h.48A4.58 4.58 0 1 0 21 5.29a6.7 6.7 0 0 1 3.76 5.99Zm-2.47 5.17a21.45 21.45 0 0 1 5.71 2a2.71 2.71 0 0 1 .68.53H34v-3.42a.72.72 0 0 0-.38-.64a18 18 0 0 0-8.4-2.05h-.66a6.66 6.66 0 0 1-2.27 3.58ZM6.53 20.92A2.76 2.76 0 0 1 8 18.47a21.45 21.45 0 0 1 5.71-2a6.66 6.66 0 0 1-2.27-3.55h-.66a18 18 0 0 0-8.4 2.05a.72.72 0 0 0-.38.64V22h4.53Zm14.93 5.77h5.96v1.4h-5.96z"></path>
        <path d="M32.81 21.26h-6.87v-1a1 1 0 0 0-2 0v1H22v-2.83a20.17 20.17 0 0 0-4-.43a19.27 19.27 0 0 0-9.06 2.22a.76.76 0 0 0-.41.68v5.61h7.11v6.09a1 1 0 0 0 1 1h16.17a1 1 0 0 0 1-1V22.26a1 1 0 0 0-1-1Zm-1 10.36H17.64v-8.36h6.3v.91a1 1 0 0 0 2 0v-.91h5.87Z"></path>
      </g>
    </svg>
  ),
  Book: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M14 2v13H3.5a1.5 1.5 0 1 1 0-3H13V0H3C1.9 0 1 .9 1 2v12c0 1.1.9 2 2 2h12V2h-1z"
      ></path>
      <path
        fill="currentColor"
        d="M3.501 13H3.5a.5.5 0 0 0 0 1h9.499v-1H3.501z"
      ></path>
    </svg>
  ),

  Open: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
      className={cn(className)}
    >
      <g fill="currentColor">
        <path d="M14.5 14.5v-3.25a.5.5 0 0 1 1 0V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h3.75a.5.5 0 0 1 0 1H5.5v9h9Z"></path>
        <path d="M10.354 10.354a.5.5 0 0 1-.708-.708l5-5a.5.5 0 0 1 .708.708l-5 5Z"></path>
        <path d="M15.5 8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 1 0v3.5Z"></path>
        <path d="M11.5 5.5a.5.5 0 0 1 0-1H15a.5.5 0 0 1 0 1h-3.5Z"></path>
      </g>
    </svg>
  ),
  BorrowBook: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 479 511.83"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M219.08 0h197.57v226.67c-.36 6.16-8.32 6.3-16.92 5.92H216.16c-11.88 0-21.6 9.72-21.6 21.62 0 11.89 9.72 21.61 21.6 21.61h191.48v-23h16.91v29.24c0 5.32-4.34 9.66-9.68 9.66H217.01c-27.07 0-38.91-9.57-38.91-30.97V40.98C178.1 18.44 196.53 0 219.08 0zM6.73 300.41h82.33c3.7 0 6.73 3.03 6.73 6.73v159.27c0 3.71-3.03 6.73-6.73 6.73H6.73c-3.7 0-6.73-3.02-6.73-6.73V307.14c0-3.7 3.03-6.73 6.73-6.73zm110.4 158.79V315.82c70.69 1.65 84.62-1.24 147.39 40.35l50.09 1.17c22.64 1.89 33.98 25.15 11.61 39.74-17.88 12.46-41.03 11.19-64.73 8.51-16.36-1.18-17.59 20.81-.49 21.29 5.92.6 12.4-.64 18.04-.52 29.65.66 54.2-4.44 69.69-27.51l7.92-17.35 75.37-35.21c37.57-11.41 63.15 28.21 35.06 54.69-54.88 38.01-110.99 69.04-168.2 93.81-41.69 24.05-82.79 22.24-123.34-2.87l-58.41-32.72z"
      />
    </svg>
  ),

  Starred: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
      className={cn(className)}
    >
      <path
        fill="#FCD53F"
        d="m18.7 4.627l2.247 4.31a2.27 2.27 0 0 0 1.686 1.189l4.746.65c2.538.35 3.522 3.479 1.645 5.219l-3.25 2.999a2.225 2.225 0 0 0-.683 2.04l.793 4.398c.441 2.45-2.108 4.36-4.345 3.24l-4.536-2.25a2.282 2.282 0 0 0-2.006 0l-4.536 2.25c-2.238 1.11-4.786-.79-4.345-3.24l.793-4.399c.14-.75-.12-1.52-.682-2.04l-3.251-2.998c-1.877-1.73-.893-4.87 1.645-5.22l4.746-.65a2.23 2.23 0 0 0 1.686-1.189l2.248-4.309c1.144-2.17 4.264-2.17 5.398 0Z"
      ></path>
    </svg>
  ),
  Transaction: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20.8 13a2 2 0 0 0-1.8-1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1-1.8-1m2.8-8v10M3 5a2 2 0 1 0 4 0a2 2 0 1 0-4 0m12 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M7 5h8M7 5v8a3 3 0 0 0 3 3h1"
      ></path>
    </svg>
  ),
  Star: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="m18.7 4.627l2.247 4.31a2.27 2.27 0 0 0 1.686 1.189l4.746.65c2.538.35 3.522 3.479 1.645 5.219l-3.25 2.999a2.225 2.225 0 0 0-.683 2.04l.793 4.398c.441 2.45-2.108 4.36-4.345 3.24l-4.536-2.25a2.282 2.282 0 0 0-2.006 0l-4.536 2.25c-2.238 1.11-4.786-.79-4.345-3.24l.793-4.399c.14-.75-.12-1.52-.682-2.04l-3.251-2.998c-1.877-1.73-.893-4.87 1.645-5.22l4.746-.65a2.23 2.23 0 0 0 1.686-1.189l2.248-4.309c1.144-2.17 4.264-2.17 5.398 0Z"
      ></path>
    </svg>
  ),
  Fine: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M20 12V5.749a.6.6 0 0 0-.176-.425l-3.148-3.148A.6.6 0 0 0 16.252 2H4.6a.6.6 0 0 0-.6.6v18.8a.6.6 0 0 0 .6.6H13M8 10h8M8 6h4m-4 8h3"></path>
        <path d="M16 2v3.4a.6.6 0 0 0 .6.6H20m-.008 9.125l2.556.649c.266.068.453.31.445.584C22.821 22.116 19.5 23 19.5 23s-3.321-.884-3.493-6.642a.588.588 0 0 1 .445-.584l2.556-.649c.323-.082.661-.082.984 0Z"></path>
      </g>
    </svg>
  ),

  History: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M22.5 12c0-5.799-4.701-10.5-10.5-10.5c-1.798 0-3.493.453-4.975 1.251A10.55 10.55 0 0 0 3.5 5.834V2.5h-2v7h7v-2H4.787a8.545 8.545 0 0 1 3.187-2.988A8.458 8.458 0 0 1 12 3.5a8.5 8.5 0 1 1-8.454 9.396l-.104-.995l-1.989.209l.104.994C2.11 18.384 6.573 22.5 12 22.5c5.799 0 10.5-4.701 10.5-10.5ZM11 6v6.414l3.5 3.5l1.414-1.414L13 11.586V6h-2Z"
      ></path>
    </svg>
  ),

  Eye: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 472 384"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M235 32q79 0 142.5 44.5T469 192q-28 71-91.5 115.5T235 352T92 307.5T0 192q28-71 92-115.5T235 32zm0 267q44 0 75-31.5t31-75.5t-31-75.5T235 85t-75.5 31.5T128 192t31.5 75.5T235 299zm-.5-171q26.5 0 45.5 18.5t19 45.5t-19 45.5t-45.5 18.5t-45-18.5T171 192t18.5-45.5t45-18.5z"
      ></path>
    </svg>
  ),

  Plus: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 42 42"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M39.5 22.5v-3c0-1.48-.43-2-2-2h-13v-13c0-1.48-.49-2-2-2h-3c-1.55 0-2 .52-2 2v13h-14c-1.48 0-2 .49-2 2v3c0 1.55.52 2 2 2h14v14c0 1.51.48 2 2 2h3c1.48 0 2-.43 2-2v-14h13c1.51 0 2-.48 2-2z"
      ></path>
    </svg>
  ),
  Staff: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 36 36"
      {...props}
      className={cn(className)}
    >
      <g id="clarityEmployeeSolid0" fill="currentColor">
        <circle cx="16.86" cy="9.73" r="6.46"></circle>
        <path d="M21 28h7v1.4h-7z"></path>
        <path d="M15 30v3a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1h-7v-1.47a1 1 0 0 0-2 0V22h-2v-3.58a32.12 32.12 0 0 0-5.14-.42a26 26 0 0 0-11 2.39a3.28 3.28 0 0 0-1.88 3V30Zm17 2H17v-8h7v.42a1 1 0 0 0 2 0V24h6Z"></path>
      </g>
    </svg>
  ),

  Language: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 20 20"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 18h-1.44a.61.61 0 0 1-.4-.12a.81.81 0 0 1-.23-.31L17 15h-5l-1 2.54a.77.77 0 0 1-.22.3a.59.59 0 0 1-.4.14H9l4.55-11.47h1.89zm-3.53-4.31L14.89 9.5a11.62 11.62 0 0 1-.39-1.24q-.09.37-.19.69l-.19.56l-1.58 4.19zm-6.3-1.58a13.43 13.43 0 0 1-2.91-1.41a11.46 11.46 0 0 0 2.81-5.37H12V4H7.31a4 4 0 0 0-.2-.56C6.87 2.79 6.6 2 6.6 2l-1.47.5s.4.89.6 1.5H0v1.33h2.15A11.23 11.23 0 0 0 5 10.7a17.19 17.19 0 0 1-5 2.1q.56.82.87 1.38a23.28 23.28 0 0 0 5.22-2.51a15.64 15.64 0 0 0 3.56 1.77zM3.63 5.33h4.91a8.11 8.11 0 0 1-2.45 4.45a9.11 9.11 0 0 1-2.46-4.45z"
      />
    </svg>
  ),
  Theme: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M7.5 2c-1.79 1.15-3 3.18-3 5.5s1.21 4.35 3.03 5.5C4.46 13 2 10.54 2 7.5A5.5 5.5 0 0 1 7.5 2m11.57 1.5l1.43 1.43L4.93 20.5L3.5 19.07L19.07 3.5m-6.18 2.43L11.41 5L9.97 6l.42-1.7L9 3.24l1.75-.12l.58-1.65L12 3.1l1.73.03l-1.35 1.13l.51 1.67m-3.3 3.61l-1.16-.73l-1.12.78l.34-1.32l-1.09-.83l1.36-.09l.45-1.29l.51 1.27l1.36.03l-1.05.87l.4 1.31M19 13.5a5.5 5.5 0 0 1-5.5 5.5c-1.22 0-2.35-.4-3.26-1.07l7.69-7.69c.67.91 1.07 2.04 1.07 3.26m-4.4 6.58l2.77-1.15l-.24 3.35l-2.53-2.2m4.33-2.7l1.15-2.77l2.2 2.54l-3.35.23m1.15-4.96l-1.14-2.78l3.34.24l-2.2 2.54M9.63 18.93l2.77 1.15l-2.53 2.19l-.24-3.34Z"
      />
    </svg>
  ),
  VietNam: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 36 36"
      className={cn(className)}
      {...props}
    >
      <path
        fill="#DA251D"
        d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
      />
      <path
        fill="#FF0"
        d="M19.753 16.037L18 10.642l-1.753 5.395h-5.672l4.589 3.333l-1.753 5.395L18 21.431l4.589 3.334l-1.753-5.395l4.589-3.333z"
      />
    </svg>
  ),
  UnitedStates: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 36 36"
      className={cn(className)}
      {...props}
    >
      <path
        fill="#B22334"
        d="M35.445 7C34.752 5.809 33.477 5 32 5H18v2h17.445zM0 25h36v2H0zm18-8h18v2H18zm0-4h18v2H18zM0 21h36v2H0zm4 10h28c1.477 0 2.752-.809 3.445-2H.555c.693 1.191 1.968 2 3.445 2zM18 9h18v2H18z"
      />
      <path
        fill="#EEE"
        d="M.068 27.679c.017.093.036.186.059.277c.026.101.058.198.092.296c.089.259.197.509.333.743L.555 29h34.89l.002-.004a4.22 4.22 0 0 0 .332-.741a3.75 3.75 0 0 0 .152-.576c.041-.22.069-.446.069-.679H0c0 .233.028.458.068.679zM0 23h36v2H0zm0-4v2h36v-2H18zm18-4h18v2H18zm0-4h18v2H18zM0 9zm.555-2l-.003.005L.555 7zM.128 8.044c.025-.102.06-.199.092-.297a3.78 3.78 0 0 0-.092.297zM18 9h18c0-.233-.028-.459-.069-.68a3.606 3.606 0 0 0-.153-.576A4.21 4.21 0 0 0 35.445 7H18v2z"
      />
      <path fill="#3C3B6E" d="M18 5H4a4 4 0 0 0-4 4v10h18V5z" />
      <path
        fill="#FFF"
        d="m2.001 7.726l.618.449l-.236.725L3 8.452l.618.448l-.236-.725L4 7.726h-.764L3 7l-.235.726zm2 2l.618.449l-.236.725l.617-.448l.618.448l-.236-.725L6 9.726h-.764L5 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 9l-.235.726zm-8 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L5 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 13l-.235.726zm-6-6l.618.449l-.236.725L7 8.452l.618.448l-.236-.725L8 7.726h-.764L7 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 7l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 11l-.235.726zM6.383 12.9L7 12.452l.618.448l-.236-.725l.618-.449h-.764L7 11l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 11l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 11l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 15l-.235.726zM6.383 16.9L7 16.452l.618.448l-.236-.725l.618-.449h-.764L7 15l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 15l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 15l-.235.726z"
      />
    </svg>
  ),
  Time: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 432 432"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M213.5 3q88.5 0 151 62.5T427 216t-62.5 150.5t-151 62.5t-151-62.5T0 216T62.5 65.5T213.5 3zm0 384q70.5 0 120.5-50t50-121t-50-121t-120.5-50T93 95T43 216t50 121t120.5 50zM224 109v112l96 57l-16 27l-112-68V109h32z"
      />
    </svg>
  ),

  Setting: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 42 42"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M6.62 24.5c.4 1.62 1.06 3.13 1.93 4.49l-2.43 2.44c-1.09 1.09-1.08 1.74-.12 2.7l2.37 2.37c.97.971 1.63.95 2.7-.12l2.55-2.56c1.2.688 2.5 1.22 3.88 1.56v3.12c0 1.55.47 2 1.82 2h3.36c1.37 0 1.82-.48 1.82-2v-3.12c1.38-.34 2.68-.87 3.88-1.56l2.61 2.619c1.08 1.068 1.729 1.09 2.699.131l2.381-2.381c.949-.949.97-1.602-.131-2.699l-2.5-2.5a14.665 14.665 0 0 0 1.938-4.49h3.302c1.368 0 1.818-.48 1.818-2v-3c0-1.48-.393-2-1.818-2h-3.302c-.34-1.38-.87-2.68-1.562-3.88l2.382-2.37c1.05-1.05 1.14-1.7.13-2.7l-2.38-2.38c-.95-.95-1.632-.94-2.7.13l-2.26 2.25A14.946 14.946 0 0 0 24.5 6.62V3.5c0-1.48-.391-2-1.82-2h-3.36c-1.35 0-1.82.49-1.82 2v3.12c-1.62.4-3.13 1.06-4.49 1.93L10.75 6.3C9.68 5.23 9 5.22 8.05 6.17L5.67 8.55c-1.01 1-.92 1.65.13 2.7l2.37 2.37c-.68 1.2-1.21 2.5-1.55 3.88h-3.3c-1.35 0-1.82.49-1.82 2v3c0 1.55.47 2 1.82 2h3.3zm8.66-3.5c0-3.16 2.56-5.72 5.72-5.72s5.721 2.56 5.721 5.72a5.72 5.72 0 1 1-11.441 0z"
      />
    </svg>
  ),
  SignOut: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 16 16"
      className={cn(className)}
      {...props}
    >
      <path fill="currentColor" d="M14 0h2v16h-2V0zM8 6H0v4h8v3l5-5l-5-5z" />
    </svg>
  ),

  Hamburger: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.5 6.5h15M4.5 12h15m-15 5.5h15"
      ></path>
    </svg>
  ),
  Upload: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...props}
    >
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M12 2a6.001 6.001 0 0 0-5.476 3.545a23.012 23.012 0 0 1-.207.452l-.02.001C6.233 6 6.146 6 6 6a4 4 0 1 0 0 8h.172l2-2H6a2 2 0 1 1 0-4h.064c.208 0 .45.001.65-.04a1.94 1.94 0 0 0 .7-.27c.241-.156.407-.35.533-.527a2.39 2.39 0 0 0 .201-.36c.053-.11.118-.255.196-.428l.004-.01a4.001 4.001 0 0 1 7.304 0l.005.01c.077.173.142.317.195.428c.046.097.114.238.201.36c.126.176.291.371.533.528c.242.156.487.227.7.27c.2.04.442.04.65.04L18 8a2 2 0 1 1 0 4h-2.172l2 2H18a4 4 0 0 0 0-8c-.146 0-.233 0-.297-.002h-.02A6.001 6.001 0 0 0 12 2m5.702 4.034"
        clip-rule="evenodd"
      />
      <path
        fill="#fff"
        d="m12 12l-.707-.707l.707-.707l.707.707zm1 9a1 1 0 1 1-2 0zm-5.707-5.707l4-4l1.414 1.414l-4 4zm5.414-4l4 4l-1.414 1.414l-4-4zM13 12v9h-2v-9z"
      />
    </svg>
  ),
  Check: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0c1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263c-12.512-12.496-32.768-12.496-45.28 0z"
      ></path>
    </svg>
  ),
  X: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 8 8"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M1.41 0L0 1.41l.72.72L2.5 3.94L.72 5.72L0 6.41l1.41 1.44l.72-.72l1.81-1.81l1.78 1.81l.69.72l1.44-1.44l-.72-.69l-1.81-1.78l1.81-1.81l.72-.72L6.41 0l-.69.72L3.94 2.5L2.13.72L1.41 0z"
      ></path>
    </svg>
  ),
  Total: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 2048 2048"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M1792 384h-128V256H475l768 768l-768 768h1189v-128h128v256H256v-91l805-805l-805-805v-91h1536v256z"
      ></path>
    </svg>
  ),
  AudioBook: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
      className={cn(className)}
    >
      <path
        fill="#00B1FF"
        d="M96.894 12.915a4.742 4.742 0 0 0-7.037-4.153L35.109 38.986a4.744 4.744 0 0 0-2.451 4.154v63.756a16.061 16.061 0 0 0-6.685-1.462c-8.918 0-16.147 7.229-16.147 16.147s7.229 16.147 16.147 16.147c8.762 0 15.877-6.983 16.124-15.686c.017-.153.05-.292.05-.461V65.988l45.26-24.987v34.057a16.068 16.068 0 0 0-6.659-1.449c-8.918 0-16.147 7.229-16.147 16.147s7.229 16.147 16.147 16.147s16.147-7.229 16.147-16.147c0-.092-.012-.18-.014-.271c.001-.046.014-.089.014-.136V12.915zm395.25-7.569l-25.341 13.99a5.303 5.303 0 0 0-2.739 4.642v71.243a17.953 17.953 0 0 0-7.47-1.633c-9.965 0-18.044 8.078-18.044 18.044c0 9.965 8.078 18.043 18.044 18.043c9.793 0 17.746-7.807 18.018-17.534c.019-.169.055-.323.055-.509V51.603c0-1.292.702-2.482 1.833-3.106l19.074-10.53a3.547 3.547 0 0 0 1.833-3.106V8.452c0-2.701-2.898-4.412-5.263-3.106z"
      ></path>
      <path
        fill="#176068"
        d="M178.715 115.298c-5.569 0-11.02-2.748-14.249-7.785c-5.038-7.86-2.749-18.316 5.111-23.354c57.774-37.027 134.635-36.991 191.261.083c7.811 5.114 9.997 15.592 4.883 23.403c-5.115 7.811-15.592 9.996-23.403 4.883c-45.668-29.901-107.756-29.861-154.498.096a16.821 16.821 0 0 1-9.105 2.674z"
      ></path>
      <path
        fill="#B9C5C6"
        d="M436.526 252.625c-10.69 0-19.355-8.666-19.355-19.355c0-84.311-68.592-152.903-152.903-152.903S111.364 148.959 111.364 233.27c0 10.69-8.666 19.355-19.355 19.355s-19.356-8.666-19.356-19.355c0-105.657 85.958-191.614 191.614-191.614s191.614 85.958 191.614 191.614c0 10.689-8.665 19.355-19.355 19.355z"
      ></path>
      <path
        fill="#96A9B2"
        d="M92.009 360.936a6.636 6.636 0 0 1-6.636-6.636V233.27a6.636 6.636 0 1 1 13.272 0V354.3a6.635 6.635 0 0 1-6.636 6.636zm351.152-6.636V233.27a6.636 6.636 0 1 0-13.272 0V354.3a6.636 6.636 0 1 0 13.272 0z"
      ></path>
      <path
        fill="#B9C5C6"
        d="M136.653 263.524c-40.721 0-73.732 33.011-73.732 73.733c0 40.721 33.011 73.732 73.732 73.732h21.888V263.524h-21.888zm257.593 0h-21.888v147.465h21.888c40.721 0 73.732-33.011 73.732-73.732c0-40.722-33.011-73.733-73.732-73.733z"
      ></path>
      <path
        fill="#96A9B2"
        d="M90.976 508.633a40.139 40.139 0 0 1-10.426-1.354c-12.688-3.4-22.309-13.065-25.736-25.855c-2.185-8.156-4.706-29.688 19.031-53.425c2.688-2.688 5.149-5.001 7.32-7.04c12.419-11.666 16.167-15.188 16.167-46.836a6.636 6.636 0 1 1 13.272 0c0 35.957-5.875 42.909-20.352 56.51c-2.1 1.973-4.48 4.209-7.023 6.751c-18.846 18.846-17.184 34.674-15.595 40.604c2.218 8.277 8.178 14.28 16.351 16.471c12.449 3.336 27.47-2.63 41.209-16.368c20.292-20.293 44.154-27.753 63.826-19.963c15.289 6.057 25.119 20.537 25.656 37.792a6.636 6.636 0 1 1-13.265.412c-.375-12.059-6.834-21.728-17.278-25.864c-14.597-5.782-33.122.576-49.553 17.008c-13.788 13.785-29.193 21.157-43.604 21.157z"
      ></path>
      <path
        fill="#176068"
        d="M170.616 263.088v148.336a6.52 6.52 0 0 1-6.52 6.52h-11.109a6.52 6.52 0 0 1-6.52-6.52V263.089a6.52 6.52 0 0 1 6.52-6.52h11.109a6.518 6.518 0 0 1 6.52 6.519zm207.296-6.52h-11.109a6.52 6.52 0 0 0-6.52 6.52v148.336a6.52 6.52 0 0 0 6.52 6.52h11.109a6.52 6.52 0 0 0 6.52-6.52V263.089a6.52 6.52 0 0 0-6.52-6.521zm58.614-29.819a6.52 6.52 0 1 0 0 13.04a6.52 6.52 0 0 0 0-13.04zm-344.517 0a6.52 6.52 0 1 0 0 13.04a6.52 6.52 0 0 0 0-13.04z"
      ></path>
    </svg>
  ),
  Ebook: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 72 72"
      {...props}
      className={cn(className)}
    >
      <path fill="#D0CFCE" d="M13.353 8.12h44.879v55.438H13.353z"></path>
      <path
        fill="#FFF"
        d="M58.231 25.747L40.604 8.12H19.936l-.022.021l38.317 38.317z"
      ></path>
      <path fill="#3F3F3F" d="M17.881 13.037H54.04v41.439H17.881z"></path>
      <path fill="#9B9B9A" d="M54.04 42.266V21.555l-8.518-8.518H24.81z"></path>
      <path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M13.47 62.54V9.166c0-.55.45-1 1-1h43.044c.55 0 1 .45 1 1v53.372c0 .55-.45 1-1 1H14.47c-.55 0-1-.45-1-1z"
      ></path>
      <circle cx="35.992" cy="59.084" r="2"></circle>
      <path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M17.881 13.037H54.04v41.439H17.881z"
      ></path>
    </svg>
  ),
}
