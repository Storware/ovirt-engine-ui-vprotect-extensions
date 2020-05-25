import { NotesAction, REMOVE_NOTE, SET_NOTES } from './types';

export type NotesStore = {
  readonly notes?: any[];
};

const initial: NotesStore = {
  notes: [],
};

export default (state = initial, action: NotesAction) => {
  if (action.type === SET_NOTES) {
    return {
      ...state,
      notes: action.payload,
    };
  }
  if (action.type === REMOVE_NOTE) {
    return {
      ...state,
      notes: state.notes && state.notes.filter(el => el.id !== action.payload),
    };
  }
  return state;
};
