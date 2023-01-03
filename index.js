const path = require('path');
const basename = path.dirname(require.main.filename);
global.App = global.App || {};
global.App.base = {
  modulePath(el, sub){
    // Check if have not start @
    if (el.charAt(0) !== '@') root = [basename, 'src', el, sub].join(path.sep);
    else root = [basename, 'node_modules', el.replace(/^@/, ''), sub].join(path.sep);
  
    return root;
  }
};

module.exports = {
  rq(str){
    // Check if have not start @
    if (str.charAt(0) !== '@') {
      return require([basename, 'src', str , 'index'].join(path.sep));
    }

    return require(str.replace(/^@/, ''));
  },

  async run(appInfo, options) {
    let args = {...appInfo, options};

    // Before hook
    options.modules.forEach((el) => {
      const module = this.rq(el);
      module.register && module.register(args);
    });

    // Boot hook
    options.modules.forEach((el) => {
      const module = this.rq(el);
      module.boot && module.boot(args);
    });
  }
};
