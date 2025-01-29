// import * as React from "react"
// import {
//   Viewer,
//   type RenderPage,
//   type RenderPageProps,
// } from "@react-pdf-viewer/core"

// import "@react-pdf-viewer/core/lib/styles/index.css"

// interface Props {
//   mark: string
//   fileUrl: string
// }

// const EbookWatermark = ({ fileUrl, mark }: Props) => {
//   const renderPage: RenderPage = (props: RenderPageProps) => (
//     <>
//       {props.canvasLayer.children}
//       <div className="absolute left-0 top-0 flex size-full items-center justify-center">
//         <div className="-rotate-45 select-none text-4xl font-extrabold uppercase text-primary">
//           {mark}
//         </div>
//       </div>
//       {props.annotationLayer.children}
//       {props.textLayer.children}
//     </>
//   )

//   return <Viewer fileUrl={fileUrl} renderPage={renderPage} />
// }

// export default EbookWatermark
