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
      options.modules.forEach((e) => {
        e.imports.forEach((name) => {
          modules.push({
            root: e.root,
            name
          });
        });
      });
    }

    options.modules = modules;

    let args = {...appInfo, options};

    global.Aloop.options = options;
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
