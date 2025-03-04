import  StreamClientProvider  from "@/components/providers/StreamClientProvider"
import { Children } from "react";

const layout = ({ children } :{ children : React.ReactNode}) => {
  return (
   <StreamClientProvider>
     { children }
   </StreamClientProvider>
  )
}

export default layout;