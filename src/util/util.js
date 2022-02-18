function HasOwnProperty(object, key) {
    // return Object.prototype.isPrototypeOf.call(object, key)
    return object.hasOwnProperty(key)
}

export function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

export function _repairAutocomplete() {
    const el = this.$el
    el.querySelectorAll(`input[type="text"][autocomplete="off"`).forEach(it => {
        it.setAttribute('autocomplete', 'new-password')
    })
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    console.log(date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    const s = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    console.log(s);
    return s;
}

export default HasOwnProperty;