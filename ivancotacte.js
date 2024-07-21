const got = require('got');
const moment = require("moment-timezone");
const encode = require('encodeurl');

let config = {
    stars_repo : (process.env.REPO)?process.env.REPO:'ivancotacte/test'
};

String.prototype.replaceAll = function(strReplace, strWith) {
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};
let get_users = async function() {
    let thanks_to = [];
    let stars = await got('https://api.github.com/repos/'+config.stars_repo+'/stargazers').json();
    for (let user of stars) {
        thanks_to.push({ 
            name:user.login,
            github:user.html_url,
            avatar:user.avatar_url 
        });
    }
    return thanks_to;
};

module.exports = {
    matchWord: 'TEST_REPO',
    transforms: {
        async LAST_UPDATE(content) {
            let currentTime = moment().tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss');
            let encoded = encode(currentTime);
            return `![last_update](https://img.shields.io/badge/last%20update-${encoded}-blue)`;
        },
    },
    callback: function () {
        console.log('markdown processing done')
    }
};