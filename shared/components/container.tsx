import React from "react";
import { cn } from "../utils/utils";


interface Props {
    className?: string;
    children?: React.ReactNode
  }
  
 export const Container: React.FC<Props> = ({ className,children }) => {
      return (
          <div className={cn("container max-w-screen-xl mx-auto px-4",className)}>
              {children}
          </div>
      );
  };