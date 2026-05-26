import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import store from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";

type PrefetchProps = {};

const Prefetch: React.FC<PrefetchProps> = ({}) => {
  useEffect(() => {
    console.log("Subscribing...");

    const notes = store.dispatch(
      notesApiSlice.endpoints.getNotes.initiate(undefined),
    );

    const users = store.dispatch(
      usersApiSlice.endpoints.getUsers.initiate(undefined),
    );

    return () => {
      console.log("Unsubscribing...");

      notes.unsubscribe();

      users.unsubscribe();
    };
  }, []);
  return <Outlet />;
};

export default Prefetch;
