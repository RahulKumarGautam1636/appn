export const requestStatusHandlers = (builder: any, thunk: any, options:any = {}) => {
  builder
    .addCase(thunk.pending, (state: any, action: any) => {
      state.status = 'loading';
      state.error = null;
      state.currentRequestId = action.meta.requestId;
    })
    .addCase(thunk.fulfilled, (state: any, action: any) => {
      if (state.currentRequestId !== action.meta.requestId) return;
      state.status = 'succeeded';
      state.currentRequestId = undefined;
      if (options.onSuccess) options.onSuccess(state, action);
    })
    .addCase(thunk.rejected, (state: any, action: any) => {
      if (state.currentRequestId !== action.meta.requestId) return;
      state.status = 'failed';
      state.currentRequestId = undefined;
      state.error = action.payload || action.error.message;
    });
};