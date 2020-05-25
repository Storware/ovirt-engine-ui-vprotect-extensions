import {RootState} from '../index';

export const selectNotes = (store: RootState) => store.notes.notes;
