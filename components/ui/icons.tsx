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
  Sort: ({ className, ...props }: IconProps) => (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 .75A.75.75 0 0 1 .75 0h6.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 .75M3.25 3a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5zm2 3a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5zm5.5-6a1 1 0 0 1 1 1v9h1.5a.75.75 0 0 1 .53 1.28l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5A.75.75 0 0 1 8.25 10h1.5V1a1 1 0 0 1 1-1"
        clipRule="evenodd"
      />
    </svg>
  ),
  Percent: ({ className, ...props }: IconProps) => (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 .75A.75.75 0 0 1 .75 0h6.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 .75M3.25 3a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5zm2 3a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5zm5.5-6a1 1 0 0 1 1 1v9h1.5a.75.75 0 0 1 .53 1.28l-2.5 2.5a.75.75 0 0 1-1.06 0l-2.5-2.5A.75.75 0 0 1 8.25 10h1.5V1a1 1 0 0 1 1-1"
        clipRule="evenodd"
      />
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
  Alarm: ({ className, ...props }: IconProps) => (
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
        d="M8.18 20.115a.998.998 0 0 0-.366 1.366c.275.48.89.643 1.365.367a1.001 1.001 0 0 0-1.001-1.732zm1-7.876a.999.999 0 1 0-1.001 1.731a.998.998 0 1 0 1-1.731zm-.555 4.803a1 1 0 1 0-2 0a1 1 0 0 0 2 0zm7.687-13.086V3.03h1a.5.5 0 0 0 .5-.5v-.5c0-.274-.225-.5-.5-.5h-3.625c-.275 0-.5.226-.5.5v.5a.5.5 0 0 0 .5.5h1v.927c-6.868.424-12.31 6.11-12.313 13.085c.002 7.25 5.877 13.124 13.126 13.127c7.25-.004 13.124-5.88 13.125-13.128c0-6.975-5.444-12.662-12.313-13.085zm-.812 23.21A10.14 10.14 0 0 1 5.375 17.041A10.14 10.14 0 0 1 15.5 6.916a10.139 10.139 0 0 1 10.124 10.125A10.137 10.137 0 0 1 15.5 27.165zm-3.438-4.17a1.001 1.001 0 0 0-1 1.733a1 1 0 0 0 1-1.732zm0-11.91a1 1 0 1 0-1-1.73a1 1 0 0 0 1 1.731zm10.76 2.884a1 1 0 1 0-1.366-.365c.276.477.888.64 1.366.365zm-7.32 9.95a1 1 0 1 0-.002 1.998a1 1 0 0 0 .002-1.998zm4.436-14.565a1.001 1.001 0 1 0-.996 1.734a1.001 1.001 0 0 0 .995-1.733zm3.44 6.687a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-.555 4.073a1.004 1.004 0 0 0-1.367.365a1 1 0 1 0 1.367-.364zM15.5 8.167c-.55 0-1 .448-1 1l-.465 7.343l-3.004 1.96a1.001 1.001 0 0 0 1.001 1.732l3.306-1.676c.055.006.11.017.166.017a1.5 1.5 0 0 0 1.5-1.5l-.5-7.876c0-.553-.45-1-1-1zm3.44 14.83a1 1 0 1 0 .999 1.733a1.001 1.001 0 0 0-1.001-1.732zM11.196 3.594c-.836-1.04-2.103-1.718-3.54-1.718a4.562 4.562 0 0 0-4.563 4.562c0 .957.297 1.843.8 2.576a14.178 14.178 0 0 1 7.303-5.42zm15.91 5.42c.502-.732.8-1.618.8-2.575a4.563 4.563 0 0 0-4.563-4.562c-1.438 0-2.704.678-3.54 1.717a14.18 14.18 0 0 1 7.302 5.42z"
      ></path>
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
  Save: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 624 737"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M390 0v149h78L312 337L156 149h82V0h152zm132 241l91 144c5 12 11 35 11 49v277c0 15-12 26-26 26H27c-15 0-27-11-27-26V434c0-14 5-37 10-49l91-144c5-13 23-24 36-24h41l42 51h-84L55 416c-1 0-1 1-1 2c0 2 0 3-1 4h517v-4c0-1-1-2-1-3l-81-147h-84l42-51h40c14 0 31 11 36 24zM239 530h147c13 0 25-12 25-26c0-13-12-25-25-25H239c-14 0-26 12-26 25c0 14 12 26 26 26z"
      ></path>
    </svg>
  ),
  Word: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      {...props}
      className={cn(className)}
    >
      <mask id="ipSWord0">
        <g fill="none" strokeWidth="4">
          <rect
            width="36"
            height="36"
            x="6"
            y="6"
            fill="#fff"
            stroke="#fff"
            rx="3"
          ></rect>
          <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14 16l4 16l6-13l6 13l4-16"
          ></path>
        </g>
      </mask>
      <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSWord0)"></path>
    </svg>
  ),
  Practice: ({ className, ...props }: IconProps) => (
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
        d="M5.5 2H17a2.5 2.5 0 0 1 2.5 2.5v6.813a6.5 6.5 0 0 0-8.187 8.187H4.5a1 1 0 0 0 1 1h6.232A6.518 6.518 0 0 0 12.81 22H5.5A2.5 2.5 0 0 1 3 19.5v-15A2.5 2.5 0 0 1 5.5 2ZM7 5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm16 12.5a5.5 5.5 0 1 0-11 0a5.5 5.5 0 0 0 11 0Zm-6.086-2.403l2.806 1.84a.609.609 0 0 1 .28.52a.654.654 0 0 1-.072.299a.574.574 0 0 1-.198.226l-2.807 1.915a.635.635 0 0 1-.158.077a.551.551 0 0 1-.395-.023a.686.686 0 0 1-.193-.135a.72.72 0 0 1-.13-.2a.613.613 0 0 1-.047-.237v-3.758a.622.622 0 0 1 .367-.57a.552.552 0 0 1 .547.045Z"
      ></path>
    </svg>
  ),
  Fullscreen: ({ className, ...props }: IconProps) => (
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
        strokeWidth="2"
      >
        <path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path>
        <rect width="10" height="8" x="7" y="8" rx="1"></rect>
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
  Sound: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M426.7 256c0-71-43.4-131.8-105-157.5l-16.4 39.4C351.5 157.2 384 202.8 384 256c0 53.3-32.5 98.8-78.8 118.1l16.4 39.4C383.3 387.8 426.7 327 426.7 256zm-85.4 0c0-35.5-21.7-65.9-52.5-78.7l-16.4 39.4c15.4 6.4 26.2 21.6 26.2 39.4c0 17.7-10.8 32.9-26.2 39.4l16.4 39.4c30.8-13 52.5-43.4 52.5-78.9zm13.2-236.3L338 59.1C415.1 91.2 469.3 167.2 469.3 256c0 88.7-54.2 164.8-131.3 196.9l16.4 39.4C447 453.7 512 362.5 512 256S447 58.3 354.5 19.7zM0 149.3v213.3h85.3L234.7 512V0L85.3 149.3H0z"
      ></path>
    </svg>
  ),
  Flashcards: ({ className, ...props }: IconProps) => (
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
        d="M1792 640h256v1152H512v-256H256v-256H0V128h1536v256h256v256zM128 256v896h1280V256H128zm256 1024v128h1280V512h-128v768H384zm1536 384V768h-128v768H640v128h1280z"
      ></path>
    </svg>
  ),
  Keyboard: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 432 384"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M384 43q18 0 30.5 12.5T427 85v214q0 17-12.5 29.5T384 341H43q-18 0-30.5-12.5T0 299V85q0-17 12.5-29.5T43 43h341zm-192 64v42h43v-42h-43zm0 64v42h43v-42h-43zm-64-64v42h43v-42h-43zm0 64v42h43v-42h-43zm-21 42v-42H64v42h43zm0-64v-42H64v42h43zm192 150v-43H128v43h171zm0-86v-42h-43v42h43zm0-64v-42h-43v42h43zm64 64v-42h-43v42h43zm0-64v-42h-43v42h43z"
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
  Random: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 8 8"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M6 0v1h-.5c-.35 0-.56.1-.78.38L3.31 3.16L1.78 1.38C1.56 1.12 1.34 1 1 1H0v1h1c-.05 0 .01.04.03.03l1.63 1.91L1 6H0v1h1c.35 0 .56-.1.78-.38l1.53-1.91l1.66 1.91c.22.26.44.38.78.38H6v1l2-1.5L6 5v1h-.22c-.01-.01-.05-.04-.06-.03L3.97 3.91L5.5 2H6v1l2-1.5L6 0z"
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
  Target: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "1em",
        height: "1em",
        verticalAlign: "middle",
        fill: "currentColor",
        overflow: "hidden",
      }}
      viewBox="0 0 1024 1024"
      version="1.1"
      {...props}
      className={cn(className)}
    >
      <path
        d="M511.392721 512.607279m-415.506586 0a415.506586 415.506586 0 1 0 831.013172 0 415.506586 415.506586 0 1 0-831.013172 0Z"
        fill="#E6E6E6"
      />
      <path
        d="M511.392721 1.214558c-282.448592 0-511.392721 228.944129-511.392721 511.392721s228.944129 511.392721 511.392721 511.392721 511.392721-228.944129 511.392721-511.392721-228.944129-511.392721-511.392721-511.392721z m0 926.899307c-229.487484 0-415.506586-186.019102-415.506586-415.506586s186.019102-415.506586 415.506586-415.506586 415.506586 186.019102 415.506586 415.506586-186.019102 415.506586-415.506586 415.506586z"
        fill="#469FCC"
      />
      <path
        d="M511.392721 192.986828c-176.494413 0-319.620451 143.126038-319.620451 319.620451s143.126038 319.620451 319.620451 319.620451 319.620451-143.126038 319.620451-319.620451-143.126038-319.620451-319.620451-319.620451z m0 543.354766a223.734316 223.734316 0 1 1 0-447.468631 223.734316 223.734316 0 0 1 0 447.468631z"
        fill="#469FCC"
      />
      <path
        d="M511.392721 512.607279m-127.84818 0a127.84818 127.84818 0 1 0 255.69636 0 127.84818 127.84818 0 1 0-255.69636 0Z"
        fill="#EF4D4D"
      />
      <path
        d="M0 129.062738l159.810225 159.810225 81.023785-28.094637L82.653849 102.598165zM127.84818 1.214558l-26.464573 82.653848 158.180161 158.180161L287.658406 161.024783z"
        fill="#EACA44"
      />
      <path
        d="M518.328485 505.671515a15.94906 15.94906 0 0 0-22.597166 0L139.034896 862.367938c7.319308 7.766777 14.862351 15.30982 22.597166 22.597166l356.696423-356.696423a15.94906 15.94906 0 0 0 0-22.597166z"
        fill=""
      />
      <path
        d="M518.328485 519.543043a15.94906 15.94906 0 0 1-22.597166 0L6.520257 30.331981C0.255696 24.06742-1.789875 11.953805 4.506648 5.689244c6.232599-6.264561 17.067732-5.529434 23.332293 0.735127l490.489544 490.489544a15.981023 15.981023 0 0 1 0 22.629128z"
        fill="#434854"
      />
    </svg>
  ),
  Analysis: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 36 36"
      {...props}
      className={cn(className)}
    >
      <path
        fill="currentColor"
        d="M32 13.22V29H4V7h18.57a7.447 7.447 0 0 1-.07-1c.001-.335.024-.669.07-1H4a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V12.34c-.62.39-1.294.686-2 .88Z"
        className="clr-i-outline--badged clr-i-outline-path-1--badged"
      />
      <path
        fill="currentColor"
        d="m15.62 15.222l-6.018 8.746l-4.052-3.584l1.06-1.198l2.698 2.386l6.326-9.192l6.75 10.015l6.754-8.925l1.276.966l-8.106 10.709z"
        className="clr-i-outline--badged clr-i-outline-path-2--badged"
      />
      <circle
        cx="30"
        cy="6"
        r="5"
        fill="currentColor"
        className="clr-i-outline--badged clr-i-outline-path-3--badged clr-i-badge"
      />
      <path fill="none" d="M0 0h36v36H0z" />
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
  Engage: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 14 14"
      className={cn(className)}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="5" cy="2.75" r="2.25" />
        <path d="M3.5 12.5h-3V11A4.51 4.51 0 0 1 7 7m6.5 1.5l-4.71 4.71l-2.13.29l.3-2.13l4.7-4.71L13.5 8.5z" />
      </g>
    </svg>
  ),
  Comment: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 16 16"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m4.843 10.944l-.194 2.335a.204.204 0 0 0 .339.17l2.21-1.964l.589.013L8 11.5c1.695 0 3.087-.44 4.02-1.177c.89-.702 1.48-1.76 1.48-3.323s-.59-2.62-1.48-3.323C11.087 2.94 9.695 2.5 8 2.5c-1.695 0-3.087.44-4.02 1.177C3.09 4.38 2.5 5.437 2.5 7c0 1.648.656 2.742 1.648 3.448zm1.141 3.625l1.77-1.572C7.834 13 7.916 13 8 13c3.866 0 7-2 7-6s-3.134-6-7-6s-7 2-7 6c0 2.117.878 3.674 2.277 4.67l-.123 1.484a1.704 1.704 0 0 0 2.83 1.415"
        clipRule="evenodd"
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
  Tiktok: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 291.72499821636245 291.1"
      className={cn(className)}
      {...props}
    >
      <path d="M219.51 291.1H71.58C32.05 291.1 0 259.05 0 219.51V71.58C0 32.05 32.05 0 71.58 0h147.93c39.53 0 71.58 32.05 71.58 71.58v147.93c.01 39.54-32.04 71.59-71.58 71.59z" />
      <g fill="#25f4ee">
        <path d="M120.96 123.89v-8.8a64.83 64.83 0 0 0-9.23-.79c-29.93-.06-56.42 19.33-65.41 47.87s1.62 59.62 26.18 76.71c-25.77-27.58-24.3-70.83 3.28-96.6a68.425 68.425 0 0 1 45.18-18.39z" />
        <path d="M122.62 223.53c16.73-.02 30.48-13.2 31.22-29.92V44.44h27.25a50.7 50.7 0 0 1-.79-9.44h-37.27v149.02c-.62 16.8-14.41 30.11-31.22 30.14-5.02-.04-9.97-1.28-14.42-3.6a31.276 31.276 0 0 0 25.23 12.97zM231.98 95.05v-8.29c-10.03 0-19.84-2.96-28.19-8.51a51.63 51.63 0 0 0 28.19 16.8z" />
      </g>
      <path
        d="M203.8 78.26a51.301 51.301 0 0 1-12.76-33.89h-9.95a51.564 51.564 0 0 0 22.71 33.89zM111.73 151.58c-17.28.09-31.22 14.17-31.13 31.45a31.293 31.293 0 0 0 16.71 27.53c-10.11-13.96-6.99-33.48 6.97-43.6a31.191 31.191 0 0 1 18.34-5.93c3.13.04 6.24.53 9.23 1.45v-37.93c-3.05-.46-6.14-.7-9.23-.72h-1.66v28.84c-3.01-.82-6.12-1.18-9.23-1.09z"
        fill="#fe2c55"
      />
      <path
        d="M231.98 95.05v28.84a88.442 88.442 0 0 1-51.69-16.8v75.77c-.08 37.81-30.75 68.42-68.56 68.42a67.816 67.816 0 0 1-39.22-12.4c25.73 27.67 69.02 29.25 96.7 3.52a68.397 68.397 0 0 0 21.83-50.09v-75.56a88.646 88.646 0 0 0 51.76 16.58V96.21c-3.64-.02-7.26-.4-10.82-1.16z"
        fill="#fe2c55"
      />
      <path
        d="M180.29 182.87V107.1a88.505 88.505 0 0 0 51.76 16.58V94.84a51.73 51.73 0 0 1-28.26-16.58 51.634 51.634 0 0 1-22.71-33.89h-27.25v149.24c-.71 17.27-15.27 30.69-32.54 29.99a31.278 31.278 0 0 1-24.06-12.9c-15.29-8.05-21.16-26.97-13.11-42.26a31.274 31.274 0 0 1 27.53-16.71c3.13.03 6.24.51 9.23 1.44V123.9c-37.74.64-67.82 32.19-67.18 69.93a68.353 68.353 0 0 0 18.73 45.86 67.834 67.834 0 0 0 39.29 11.61c37.82-.01 68.49-30.62 68.57-68.43z"
        fill="#fff"
      />
    </svg>
  ),
  Linkedin: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 256 256"
      className={cn(className)}
      {...props}
    >
      <g fill="none">
        <rect width="256" height="256" fill="#fff" rx="60" />
        <rect width="256" height="256" fill="#0A66C2" rx="60" />
        <path
          fill="#fff"
          d="M184.715 217.685h29.27a4 4 0 0 0 4-3.999l.015-61.842c0-32.323-6.965-57.168-44.738-57.168c-14.359-.534-27.9 6.868-35.207 19.228a.32.32 0 0 1-.595-.161V101.66a4 4 0 0 0-4-4h-27.777a4 4 0 0 0-4 4v112.02a4 4 0 0 0 4 4h29.268a4 4 0 0 0 4-4v-55.373c0-15.657 2.97-30.82 22.381-30.82c19.135 0 19.383 17.916 19.383 31.834v54.364a4 4 0 0 0 4 4ZM38 59.627c0 11.865 9.767 21.627 21.632 21.627c11.862-.001 21.623-9.769 21.623-21.631C81.253 47.761 71.491 38 59.628 38C47.762 38 38 47.763 38 59.627Zm6.959 158.058h29.307a4 4 0 0 0 4-4V101.66a4 4 0 0 0-4-4H44.959a4 4 0 0 0-4 4v112.025a4 4 0 0 0 4 4Z"
        />
      </g>
    </svg>
  ),
  Twitter: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 256 256"
      className={cn(className)}
      {...props}
    >
      <g fill="none">
        <rect width="256" height="256" fill="#fff" rx="60" />
        <rect width="256" height="256" fill="#1D9BF0" rx="60" />
        <path
          fill="#fff"
          d="M199.572 91.411c.11 1.587.11 3.174.11 4.776c0 48.797-37.148 105.075-105.075 105.075v-.03A104.54 104.54 0 0 1 38 184.677c2.918.351 5.85.526 8.79.533a74.154 74.154 0 0 0 45.864-15.839a36.976 36.976 0 0 1-34.5-25.645a36.811 36.811 0 0 0 16.672-.636c-17.228-3.481-29.623-18.618-29.623-36.198v-.468a36.705 36.705 0 0 0 16.76 4.622c-16.226-10.845-21.228-32.432-11.43-49.31a104.814 104.814 0 0 0 76.111 38.582a36.95 36.95 0 0 1 10.683-35.283c14.874-13.982 38.267-13.265 52.249 1.601a74.105 74.105 0 0 0 23.451-8.965a37.061 37.061 0 0 1-16.234 20.424A73.446 73.446 0 0 0 218 72.282a75.023 75.023 0 0 1-18.428 19.13Z"
        />
      </g>
    </svg>
  ),
  Instagram: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 256 256"
      className={cn(className)}
      {...props}
    >
      <g fill="none">
        <rect
          width="256"
          height="256"
          fill="url(#skillIconsInstagram0)"
          rx="60"
        />
        <rect
          width="256"
          height="256"
          fill="url(#skillIconsInstagram1)"
          rx="60"
        />
        <path
          fill="#fff"
          d="M128.009 28c-27.158 0-30.567.119-41.233.604c-10.646.488-17.913 2.173-24.271 4.646c-6.578 2.554-12.157 5.971-17.715 11.531c-5.563 5.559-8.98 11.138-11.542 17.713c-2.48 6.36-4.167 13.63-4.646 24.271c-.477 10.667-.602 14.077-.602 41.236s.12 30.557.604 41.223c.49 10.646 2.175 17.913 4.646 24.271c2.556 6.578 5.973 12.157 11.533 17.715c5.557 5.563 11.136 8.988 17.709 11.542c6.363 2.473 13.631 4.158 24.275 4.646c10.667.485 14.073.604 41.23.604c27.161 0 30.559-.119 41.225-.604c10.646-.488 17.921-2.173 24.284-4.646c6.575-2.554 12.146-5.979 17.702-11.542c5.563-5.558 8.979-11.137 11.542-17.712c2.458-6.361 4.146-13.63 4.646-24.272c.479-10.666.604-14.066.604-41.225s-.125-30.567-.604-41.234c-.5-10.646-2.188-17.912-4.646-24.27c-2.563-6.578-5.979-12.157-11.542-17.716c-5.562-5.562-11.125-8.979-17.708-11.53c-6.375-2.474-13.646-4.16-24.292-4.647c-10.667-.485-14.063-.604-41.23-.604h.031Zm-8.971 18.021c2.663-.004 5.634 0 8.971 0c26.701 0 29.865.096 40.409.575c9.75.446 15.042 2.075 18.567 3.444c4.667 1.812 7.994 3.979 11.492 7.48c3.5 3.5 5.666 6.833 7.483 11.5c1.369 3.52 3 8.812 3.444 18.562c.479 10.542.583 13.708.583 40.396c0 26.688-.104 29.855-.583 40.396c-.446 9.75-2.075 15.042-3.444 18.563c-1.812 4.667-3.983 7.99-7.483 11.488c-3.5 3.5-6.823 5.666-11.492 7.479c-3.521 1.375-8.817 3-18.567 3.446c-10.542.479-13.708.583-40.409.583c-26.702 0-29.867-.104-40.408-.583c-9.75-.45-15.042-2.079-18.57-3.448c-4.666-1.813-8-3.979-11.5-7.479s-5.666-6.825-7.483-11.494c-1.369-3.521-3-8.813-3.444-18.563c-.479-10.542-.575-13.708-.575-40.413c0-26.704.096-29.854.575-40.396c.446-9.75 2.075-15.042 3.444-18.567c1.813-4.667 3.983-8 7.484-11.5c3.5-3.5 6.833-5.667 11.5-7.483c3.525-1.375 8.819-3 18.569-3.448c9.225-.417 12.8-.542 31.437-.563v.025Zm62.351 16.604c-6.625 0-12 5.37-12 11.996c0 6.625 5.375 12 12 12s12-5.375 12-12s-5.375-12-12-12v.004Zm-53.38 14.021c-28.36 0-51.354 22.994-51.354 51.355c0 28.361 22.994 51.344 51.354 51.344c28.361 0 51.347-22.983 51.347-51.344c0-28.36-22.988-51.355-51.349-51.355h.002Zm0 18.021c18.409 0 33.334 14.923 33.334 33.334c0 18.409-14.925 33.334-33.334 33.334c-18.41 0-33.333-14.925-33.333-33.334c0-18.411 14.923-33.334 33.333-33.334Z"
        />
        <defs>
          <radialGradient
            id="skillIconsInstagram0"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(0 -253.715 235.975 0 68 275.717)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FD5" />
            <stop offset=".1" stopColor="#FD5" />
            <stop offset=".5" stopColor="#FF543E" />
            <stop offset="1" stopColor="#C837AB" />
          </radialGradient>
          <radialGradient
            id="skillIconsInstagram1"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(22.25952 111.2061 -458.39518 91.75449 -42.881 18.441)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3771C8" />
            <stop offset=".128" stopColor="#3771C8" />
            <stop offset="1" stopColor="#60F" stopOpacity="0" />
          </radialGradient>
        </defs>
      </g>
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
  Correct: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 1.75A10.25 10.25 0 1 0 22.25 12A10.26 10.26 0 0 0 12 1.75m5.07 8.34l-5.37 5.37a1.83 1.83 0 0 1-.65.44c-.497.2-1.053.2-1.55 0a2 2 0 0 1-.65-.44L6.19 12.8a1.001 1.001 0 1 1 1.41-1.42l2.67 2.67l5.38-5.37a1 1 0 0 1 1.42 0a1 1 0 0 1 0 1.38z"
      ></path>
    </svg>
  ),
  Wrong: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8L5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  Skip: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12Zm16.333-4.167a.825.825 0 0 0-1.166-1.166l-9.5 9.5a.825.825 0 0 0 1.166 1.166Z"
      ></path>
    </svg>
  ),
  Target2: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      className={cn(className)}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.48 7.516a6.5 6.5 0 1 1-6.93-7"></path>
        <path d="M9.79 8.09A3 3 0 1 1 5.9 4.21M7 7l2.5-2.5m2 .5l-2-.5l-.5-2l2-2l.5 2l2 .5z"></path>
      </g>
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
  Test: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M216 40H40a16 16 0 0 0-16 16v160a8 8 0 0 0 11.58 7.16L64 208.94l28.42 14.22a8 8 0 0 0 7.16 0L128 208.94l28.42 14.22a8 8 0 0 0 7.16 0L192 208.94l28.42 14.22A8 8 0 0 0 232 216V56a16 16 0 0 0-16-16Zm0 163.06l-20.42-10.22a8 8 0 0 0-7.16 0L160 207.06l-28.42-14.22a8 8 0 0 0-7.16 0L96 207.06l-28.42-14.22a8 8 0 0 0-7.16 0L40 203.06V56h176Zm-155.58-35.9a8 8 0 0 0 10.74-3.58L76.94 152h38.12l5.78 11.58a8 8 0 1 0 14.32-7.16l-32-64a8 8 0 0 0-14.32 0l-32 64a8 8 0 0 0 3.58 10.74ZM96 113.89L107.06 136H84.94ZM136 128a8 8 0 0 1 8-8h16v-16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0v-16h-16a8 8 0 0 1-8-8Z"
      ></path>
    </svg>
  ),
  Slash: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth="2"
        d="M4.109 14L9.466 1h1.352L5.46 14H4.109Z"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  BandScore: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 100 100"
      className={cn(className)}
      {...props}
    >
      <circle cx="50" cy="50" r="50" fill="#6BC9F2"></circle>
      <clipPath id="flatUiFlag0">
        <circle cx="50" cy="50" r="50"></circle>
      </clipPath>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M29 99a2.5 2.5 0 1 1-5 0V17.5a2.5 2.5 0 1 1 5 0V99z"
        clipPath="url(#flatUiFlag0)"
        clipRule="evenodd"
      ></path>
      <path fill="#F29C1F" d="M100 73H60V25h40l-7 24z"></path>
      <path
        fill="#E57E25"
        fillRule="evenodd"
        d="M60 73V27l9-8v46l-9 8z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#fff"
        d="m77.017 43.501l-10.791 3.625L65.933 58l-6.962-8.633L48 52.463l6.488-8.962L48 34.539l10.972 3.096L65.933 29l.293 10.875l10.791 3.626z"
        opacity=".6"
      ></path>
      <path fill="#F0C419" d="M29 17h40v48H29z"></path>
      <path
        fill="#fff"
        d="m69 30.157l-6.028 7.478L52 34.539l6.488 8.962L52 52.463l10.972-3.097L69 56.843z"
      ></path>
    </svg>
  ),
  Calendar: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 6h2v2H5zm3 0h2v2H8zm3 0h2v2h-2zm-9 6h2v2H2zm3 0h2v2H5zm3 0h2v2H8zM5 9h2v2H5zm3 0h2v2H8zm3 0h2v2h-2zM2 9h2v2H2zm11-9v1h-2V0H4v1H2V0H0v16h15V0h-2zm1 15H1V4h13v11z"
      ></path>
    </svg>
  ),
  ToTestDate: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      className={cn(className)}
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 13.5H1.5a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1H9m1.5 3l1.5-3l1.5 3V12a1.5 1.5 0 0 1-3 0Zm0 6h3m-10-9v13M6 4h2"
      ></path>
    </svg>
  ),
}
