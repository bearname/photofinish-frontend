import axios from 'axios';
import videosUtil from './videoUtil';
import logError from '../../util/logger';
import makeRequest from '../../api/api';
import VideoStatus from './videoStatus';
const BASE_URL = "https://thawing-sea-83431.herokuapp.com";

const actions = {
    async getVideoById(context, {videoId}) {
        try {
            const url = BASE_URL + '/api/v1/videos/' + videoId;
            const response = await axios.get(url);
            console.log(response);
            if (response.status !== 200) {
                console.log('failed get video by id');
                console.log(response);
                return;
            }
            const data = response.data;
            context.state.video = data;
            context.state.videoStatus = VideoStatus.intToStatus(data.status);
            context.state.video.uploaded = videosUtil.getElapsedString(data.uploaded);
        } catch (error) {
            logError(error);
        }
    },
    async newImages(context, {path, eventId}) {
        try {
            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            console.log(path, eventId);

            const config = {
                headers: {
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
            };

            const url =BASE_URL + `/api/v1/picture/detectText/dropbox?path=${path}&eventId=${eventId}`;
            // console.log('upload video' + url);
            axios.post(url, null, config).then(data => console.log(data)).then(err => console.log(err));
        } catch (error) {
            context.state.isProcessing = false;
            // console.error(error);
            // console.log('FAILURE!!');
        }
    },
    async getVideoOnPage(context, page = '1', countVideoOnPage = '10') {
        try {
            const url =BASE_URL + '/api/v1/videos/?page=' + page +
                '&countVideoOnPage=' + countVideoOnPage;
            // console.log(url);
            const response = await axios.get(url);
            // console.log(response.data);
            const {pageCount, videos} = response.data;

            if (Object.keys(response.data).includes('pageCount')) {
                context.state.pageCount = pageCount;
            }
            if (Object.keys(response.data).includes('videos')) {
                context.commit('SET_VIDEOS', {videos: videos});
            }
        } catch (error) {
            logError(error);
        }
    },
    async createEvent(context, {name, location, date}) {
        try {
            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            const url =BASE_URL + '/api/v1/events';
            const config = {
                method: 'POST',
                headers: {
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
                body: JSON.stringify({'name': name, 'location': location, 'date': date}),
            };

            const data = await makeRequest(context, url, config);

            // console.log(data);
            const {code, message} = data;
            context.state.success = code === 1
            context.state.message = message;
        } catch (error) {
            console.log(error);
            context.state.success = false;
            throw error;
        }
    },
    async deleteEventPermanent(context, {eventId}) {
        try {
            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            const url =BASE_URL + '/api/v1/events/' + eventId;
            const config = {
                method: 'DELETE',
                headers: {
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
            };
            const data = await makeRequest(context, url, config);

            // console.log(data);
            const {code, message} = data;
            context.state.success = code;
            context.state.message = message;
        } catch (error) {
            console.log(error);
            context.state.success = false;
            throw error;
        }
    },
   async deleteImagePermanent(context, {pictureId}) {
        try {
            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            const url =BASE_URL + '/api/v1/picture/' + pictureId;
            const config = {
                method: 'DELETE',
                headers: {
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
            };
            const data = await makeRequest(context, url, config);

            // console.log(data);
            const {code, message} = data;
            context.state.success = code;
            context.state.message = message;
        } catch (error) {
            console.log(error);
            context.state.success = false;
            throw error;
        }
    },

    async findEvents(context) {
        try {
            const offset = 0;
            const limit = 20;
            const url = BASE_URL + '/api/v1/events?offset=' + offset + '&limit=' + limit;
            const config = {
                headers: {
                    'Content-Type': 'video/mp4',
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
            };
            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            const response = await axios.get(url, config);

            const data = response.data;
            // console.log('response.data');
            // console.log(data);
            if (Object.keys(data).includes('data')) {
                context.state.events = data.data;
            }

            context.commit("SET_EVENTS", data.data)
            return data.data;
        } catch (error) {
            logError(error);
        }
    },
};

export default actions;
