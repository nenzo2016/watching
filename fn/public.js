function checkPrice(price) {
    return isInteger(price) && price > 0
}
function formatPrice(price) {
    return price / 100
}
//是否为整数
function isInteger(num) {
    return Number.isInteger(num)
}

function email_reg(value) {
    value = String(value).trim();
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}

function password_reg(value) {
    value = String(value).trim();
    // var reg= /^(?![^a-zA-Z]+$) (?!\D+$)/;
    var reg = /^[a-zA-Z\d_]{8,}$/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}

function jsonStringify(obj) {
    var cache = [];
    var json= JSON.stringify(obj, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    return json
}
function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  }
module.exports = {
    parseTime,
    checkPrice,
    isInteger,
    password_reg,
    email_reg,
    jsonStringify,
    formatPrice
}