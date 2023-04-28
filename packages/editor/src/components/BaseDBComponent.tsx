import React from 'react'
import type * as Stitches from '@stitches/react'
import type {BaseDBComponent} from "@types";

interface Props {
    component: BaseDBComponent
  }
  
  export default function BaseDBComponent ({ component }: Props) {
    return (
      <>
        {/*TODO-MARIANA query*/}
        <label>Reducer  <input type="text" value={component.reducer} ></input></label>        
      </>
    );
  }