const postcss = require('postcss');

const propDict = {
    'border-top-right-radius': 'border-radius',
    'border-top-left-radius': 'border-radius',
    'border-bottom-right-radius': 'border-radius',
    'border-bottom-left-radius': 'border-radius',

    'border-left-width': 'border-width',
    'border-right-width': 'border-width',
    'border-top-width': 'border-width',
    'border-bottom-width': 'border-width',

    'margin-left': 'margin',
    'margin-right': 'margin',
    'margin-top': 'margin',
    'margin-bottom': 'margin',

    'padding-left': 'padding',
    'padding-right': 'padding',
    'padding-top': 'padding',
    'padding-bottom': 'padding',

    'overflow-x': 'overflow',
    'overflow-y': 'overflow',
}

function getPropKey (prop) {
    if (!prop) return;
    return propDict[prop] || prop;
}

module.exports = postcss.plugin('postcss-tailwind-comments', function (opts) {
  opts = opts || {};
  return function (root) {
    root.walkRules(rule => {
      const prevRule = rule.prev();
      const prop = rule.first.prop;
      const prevProp = prevRule && prevRule.first.prop;
      const key = getPropKey(prop);
      const prevKey = getPropKey(prevProp);

      if (!prevKey) {
          rule.raws.before = `/* ${key} */\n`
      } else if (prevKey !== key) {
          rule.raws.before = `\n/* ${key} */\n`
      }
    });
  };
});
