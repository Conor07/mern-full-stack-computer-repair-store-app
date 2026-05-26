import React, { useEffect, useState } from "react";
import type { User } from "../users/usersApiSlice";
import {
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  type Note,
} from "./notesApiSlice";
import { useNavigate } from "react-router-dom";

type EditNoteFormProps = {
  note: Note;
  users: User[];
};

const EditNoteForm: React.FC<EditNoteFormProps> = ({ note, users }) => {
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);
  const [userId, setUserId] = useState(note.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);

  const onCompletedChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCompleted(e.target.checked);

  const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async () => {
    if (canSave) {
      await updateNote({ id: note.id, title, text, user: userId, completed });
    }
  };

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent =
    (isError && "data" in error
      ? (error.data as { message?: string })?.message
      : undefined) ??
    (isDelError && "data" in delerror
      ? (delerror.data as { message?: string })?.message
      : undefined) ??
    "";

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__actions">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <i className="fas fa-save"></i>
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteNoteClicked}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="note-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="note-text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <label className="form__label form__checkbox-container">
          Completed:
          <input
            type="checkbox"
            id="note-completed"
            name="completed"
            checked={completed}
            onChange={onCompletedChanged}
          />
        </label>

        <label className="form__label" htmlFor="note-username">
          Assigned To:
        </label>
        <select
          id="note-username"
          name="username"
          className={`form__select ${!userId ? "form__select--incomplete" : ""}`}
          value={userId}
          onChange={onUserIdChanged}
        >
          <option value=""></option>
          {options}
        </select>

        <p className="form__created">Created: {created}</p>
        <p className="form__updated">Updated: {updated}</p>
      </form>
    </>
  );
};

export default EditNoteForm;
