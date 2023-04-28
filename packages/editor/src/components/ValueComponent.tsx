import React from 'react'
import type * as Stitches from '@stitches/react'
import type {Value} from "@types";
import BaseDBComponent from "./BaseDBComponent";

interface Props {
    component: Value
  }
  
  export default function ValueComponent ({ component }: Props) {
    return (
      <>
        <BaseDBComponent component={component}/>
        <label>Precision <input type="number" value={component.precision} ></input></label>        
      </>
    );
  }