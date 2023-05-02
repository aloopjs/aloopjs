const path = require('path');
const basename = path.dirname(require.main.filename);
global.Aloop = global.Aloop || {};
global.Aloop.base = {
  modulePath(el, sub){
    let dir = [basename, el.root, el.name];

    if (sub) {
      dir.push(sub);
    }
  
    return dir.join(path.sep);
  }
};

module.exports = {
  rq(el){
    let p = Aloop.base.modulePath(el);
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

    global.Aloop.options = args.options;
    global.Aloop.info = appInfo;

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
