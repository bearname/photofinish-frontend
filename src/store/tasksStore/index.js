import mutations from "./mutations";
import actions from "./actions";

const state = {
    taskId: null,
    taskStats: null,
    isProcessing: false,
    responseData: false,
}

const getters = {
    getTaskId(state) {
        return state.taskId;
    },
    getTaskStats(state) {
        return state.taskStats;
    },
    getIsProcessing(state) {
        return state.isProcessing;
    },
    getResponseData(state) {
        return state.responseData;
    }
};
export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters,
};
