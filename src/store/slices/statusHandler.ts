export const requestStatusHandlers = (builder: any, thunk: any, options:any = {}) => {
  builder
    .addCase(thunk.pending, (state: any) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state: any, action: any) => {
      state.status = 'succeeded';
      if (options.onSuccess) options.onSuccess(state, action);
    })
    .addCase(thunk.rejected, (state: any, action: any) => {
      state.status = 'failed';
      state.error = action.payload || action.error.message;
    });
};