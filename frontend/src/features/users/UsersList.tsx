import React from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import { selectAllUsers } from "./usersApiSlice";
import { useAppSelector } from "../../app/hooks";
import User from "./User";

type UsersListProps = {};

const UsersList: React.FC<UsersListProps> = ({}) => {
  const { isLoading, isSuccess, isError, error } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const users = useAppSelector(selectAllUsers);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className={isError ? "errmsg" : "offscreen"}>
        {(error as any)?.data?.message}
      </div>
    );
  }

  if (isSuccess) {
    const tableContent = users?.length
      ? users.map((user: any) => <User key={user.id} userId={user.id} />)
      : null;

    return (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>

            <th scope="col" className="table__th user__roles">
              Roles
            </th>

            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
  return null;
};

export default UsersList;
