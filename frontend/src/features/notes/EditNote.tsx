import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectNoteById } from "./notesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";

type EditNoteProps = {};

const EditNote: React.FC<EditNoteProps> = ({}) => {
  const { id } = useParams();

  const note = id
    ? useSelector((state: any) => selectNoteById(state, id))
    : null;

  const users = useSelector(selectAllUsers);

  return note && users ? (
    <EditNoteForm note={note} users={users} />
  ) : (
    <p>Loading...</p>
  );
};

export default EditNote;
