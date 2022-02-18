import axios from "axios";
import BASE_URL from "../../config";
import HasOwnProperty from "../../util/util";

const actions = {
    async getTasks(context, {page = {limit: 10, offset: 0}}) {
        try {
            if (page === null) {
                page = {
                    limit: 10,
                    offset: 0
                }
            }
            if ((!HasOwnProperty(page, "limit") && !Number.isInteger(page.limit)) ||
                !HasOwnProperty(page, "offset") && !Number.isInteger(page.offset)) {
                return
            }

            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            const config = {
                headers: {
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
                body: JSON.stringify({
                    username: page.offset,
                    description: page.limit,
                }),
            };
            const url = BASE_URL + `/api/v1/tasks?offset=${page.offset}&limit=${page.limit}`;
            // console.log('upload video' + url);
            const resp = await axios.get(url, config);
            if (resp.status !== 200) {
                throw new Error(resp.data)
            }
            context.state.responseData = resp.data.data;
        } catch (e) {
            console.log(e);
            context.state.isProcessing = false;
        }
    },
    async getTaskStatistic(context, {taskId, cancelTokenSource}) {
        try {
            if (cancelTokenSource === undefined) {
                cancelTokenSource = axios.CancelToken.source()
            }
            console.log(cancelTokenSource);
            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            const config = {
                headers: {
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
                cancelToken: cancelTokenSource.token
            };
            const url = BASE_URL + `/api/v1/tasks/${taskId}/stats`;
            const resp = await axios.get(url, config);
            context.state.taskStats = resp.data.data;
        } catch (e) {
            console.log(e);
            context.state.isProcessing = false;
        }
    },
    async getDropboxFolders(context) {
        try {
            await context.dispatch('authMod/updateAuthorizationIfNeeded', {}, {root: true});
            const config = {
                headers: {
                    'Authorization': context.rootGetters['authMod/getTokenHeader'],
                },
            };
            const url = BASE_URL + `/api/v1/pictures/dropbox-folders`;
            const resp = await axios.get(url, config);
            context.state.responseData = resp.data;
        } catch (e) {
            console.log(e);
            context.state.isProcessing = false;
        }
    }
};

export default actions;