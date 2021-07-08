// A singleton user that can be passed around

var auth_user = (function () {
    var instance;

    var user_id;

    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export default auth_user