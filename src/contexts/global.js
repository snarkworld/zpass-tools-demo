import { useState } from "react";
import constate from "constate";

function useGlobal() {
  const [global, setGlobal] = useState({});

  const upsertKeyAtGlobalState = (name) => {
    setGlobal(prevState => ({...prevState, name}) )
  }

  return {
    global,
    setGlobal,
    upsertKeyAtGlobalState
  }
}

export const [GlobalProvider, useGlobalProvider] = constate(useGlobal);