import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

type NewNoteProps = {};

const NewNote: React.FC<NewNoteProps> = ({}) => {
  const users = useSelector(selectAllUsers);

  return users ? <NewNoteForm users={users} /> : <p>Loading...</p>;
};

export default NewNote;
