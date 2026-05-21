import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

interface Note {
  id: string;
  _id: string;
  [key: string]: any;
}

const notesAdapter = createEntityAdapter<Note>({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      keepUnusedDataFor: 5,
      transformResponse: (responseData: Note[]) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result: any) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id: any) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetNotesQuery } = notesApiSlice;

// returns the query result object
export const selectNotesResult =
  notesApiSlice.endpoints.getNotes.select(undefined);

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult: any) => notesResult.data, // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state: any) => selectNotesData(state) ?? initialState,
);
