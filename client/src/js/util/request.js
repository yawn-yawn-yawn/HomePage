import axios from 'axios'
import { showLoading, hideLoading } from '../actions/action'
import store from '../store/store'

// apiにgetリクエストを送信
// stateのisLoadingはここでいじってます
export async function httpGet(url, options) {
    store.dispatch(showLoading())
    return await axios.get(url, options).finally(() => store.dispatch(hideLoading()))
}

// urlに向けてpostリクエスト
export async function httpPost(url, body, options) {
    store.dispatch(showLoading())
    return await axios.post(url, body, options).finally(() => store.dispatch(hideLoading()))
}

// urlに向けてput
export async function httpPut(url, body, options) {
    store.dispatch(showLoading())
    return await axios.put(url, body, options).finally(() => store.dispatch(hideLoading()))
}

// urlに向けてdelete
export async function httpDelete(url, options) {
    store.dispatch(showLoading())
    return await axios.delete(url, options).finally(() => store.dispatch(hideLoading()))
}