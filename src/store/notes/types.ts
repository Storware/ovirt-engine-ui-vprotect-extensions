export const SET_NOTES = 'SET_NOTES';
export const REMOVE_NOTE = 'REMOVE_NOTE';

export type SetNotesAction = {
  type: typeof SET_NOTES;
  payload?: any[];
};

export type RemoveNoteAction = {
  type: typeof REMOVE_NOTE;
  payload?: string;
};

export type NotesAction = SetNotesAction | RemoveNoteAction;
