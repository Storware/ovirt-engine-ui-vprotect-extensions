import { NotesAction, REMOVE_NOTE, SET_NOTES } from './types';
import { Dispatch } from 'redux';

export const setNotes = (notes: any[]): NotesAction => {
  return {
    type: SET_NOTES,
    payload: notes,
  };
};

export const removeNote = (id: string): NotesAction => {
  return {
    type: REMOVE_NOTE,
    payload: id,
  };
};

export const getNotes = async (dispatch: Dispatch) => {
  // const response = await request('note/all', {
  //   method: 'GET',
  // });
  //
  // await dispatch(setNotes(response));
};
