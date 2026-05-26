import React from "react";
import type { User } from "../users/usersApiSlice";

type NewNoteFormProps = {
  users: User[];
};

const NewNoteForm: React.FC<NewNoteFormProps> = ({}) => {
  return <div>NewNoteForm</div>;
};

export default NewNoteForm;
