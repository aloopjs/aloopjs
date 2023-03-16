const path = require('path');
const basename = path.dirname(require.main.filename);
global.App = global.App || {};
global.App.base = {
  modulePath(el, sub){
    let dir = [];

    if (el.root == 'node_modules') {
      dir = [basename, 'node_modules', el.name];
    } else {
      dir = [basename, 'src', el.name];
    }

    if (sub) {
      dir.push(sub);
    }
  
    return dir.join(path.sep);
  }
};

module.exports = {
  rq(el){
    let p = App.base.modulePath(el);
    return require(p);
  },

  async run(appInfo, options) {
    let modules = [];

    if (options.modules) {
      modules = options.modules.map((item) => ({
        name: item,
        root: 'node_modules'
      }));
    }

    if (options.devModules) {
      let devModules = options.devModules.map((item) => ({
        name: item,
        root: 'src'
      }));

      modules = [...modules, ...devModules];
    }

    let args = {...appInfo, options: {
      modules
    }};

    // Before hook
    modules.forEach((el) => {
      const module = this.rq(el);
      module.register && module.register(args);
    });

    // Boot hook
    modules.forEach((el) => {
      const module = this.rq(el);
      module.boot && module.boot(args);
    });
  }
};
