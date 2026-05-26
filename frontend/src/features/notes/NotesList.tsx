import React from "react";
import { useGetNotesQuery } from "./notesApiSlice";
import { selectAllNotes } from "./notesApiSlice";
import { useAppSelector } from "../../app/hooks";
import Note from "./Note";

type NotesListProps = {};

const NotesList: React.FC<NotesListProps> = ({}) => {
  const { isLoading, isSuccess, isError, error } = useGetNotesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const notes = useAppSelector(selectAllNotes);

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
    const tableContent = notes?.length
      ? notes.map((note: any) => <Note key={note.id} noteId={note.id} />)
      : null;

    return (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
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

export default NotesList;
