import actions from './actions';
import mutations from './mutations';

const state = {
  eventId: null,
  isProcessing: false,
  success: false,
  message: false,
  code: false,
  error: false,
  video: null,
  events: null,
  pageCount: 0,
  url: {
    type: String,
    required: false,
    default: 'list',
  },
};

const getters = {
  getEventId(state) {
    return state.videoId;
  },
  getIsProcessing(state) {
    return state.isProcessing;
  },
  getEvents(state) {
    return state.events;
  },
  getEvent(state) {
    return state.video;
  },
  getMessage(state) {
    return state.message;
  },
  getStatus(state) {
    return state.success;
  },
  getCode(state) {
    return state.code;
  },
};

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};
