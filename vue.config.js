const webpack = require('webpack');
const path = require('path');

/**
 * Get current time
 * @example 10:34:12 am
 * @param {Date} date
 * @returns {string}
 */
function getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return hours + ':' + minutes + ':' + seconds + " " + ampm;
}

/**
 * Get current date
 * @example 13-09-2016
 * @returns {string}
 */
function getDate() {
    var currentDate = new Date();
    return ("0" + (currentDate.getMonth() + 1)).slice(-2) + '/' + ("0" + currentDate.getDate()).slice(-2) + '/' + currentDate.getFullYear() + ' @ ' + getTime(currentDate);
}


process.env.VUE_APP_VERSION = JSON.stringify(getDate());
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

    chainWebpack: config => {
        config.resolve.alias.set('fonts', path.resolve('public/fonts'));
    },

}
