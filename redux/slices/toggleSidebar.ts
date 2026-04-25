export interface CounterState {
  show: boolean;
}

const initialState: CounterState = {
  show: false,
};

import { createSlice } from '@reduxjs/toolkit';

export const toggleSidebar = createSlice({
  name: 'toggleSideBar',
  initialState,
  reducers: {
    showSidebar: (state) => {
      state.show = true;
    },
    hideSidebar: (state) => {
      state.show = false;
    }
  },
});
export const { showSidebar, hideSidebar } = toggleSidebar.actions;

export default toggleSidebar.reducer;