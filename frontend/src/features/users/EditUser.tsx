import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";

type EditUserProps = {};

const EditUser: React.FC<EditUserProps> = ({}) => {
  const { id } = useParams();

  const user = id
    ? useSelector((state: any) => selectUserById(state, id))
    : null;

  return user ? <EditUserForm user={user} /> : <p>Loading...</p>;
};

export default EditUser;
