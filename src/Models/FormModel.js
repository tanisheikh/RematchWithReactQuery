export const formModel = {
  state: {
    userList: [],
  },
  reducers: {
    createRecord(state, payload) {
      console.log("payload>>",payload)
      let _userList = state.userList;
      _userList.push(payload);
      console.log("payload2>>>",_userList)
      return {
        ...state,
        userList: _userList,
      };

    },
    updateRecord(state, payload) {},
  },
  effects: (dispatch) => ({
    createRecordAsync(payload) {
      console.log("payload>>>",payload)
     dispatch.formModel.createRecord(payload);
    },
  }),
};
