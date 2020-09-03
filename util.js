class Util {

    static isArray(ar) {
        try {
            return Array.isArray(ar) ||
               (typeof ar === 'object' && objectToString(ar) === '[object Array]');
        } catch (error) {
            return false;
        }
        
    }
}

module.exports = Util;