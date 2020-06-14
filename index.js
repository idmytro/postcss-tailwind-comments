const postcss = require('postcss');
const camelCase = require('lodash.camelcase');

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

    flex: 'flexbox',
    'flex-grow': 'flexbox',
    'flex-direction': 'flexbox',
    'flex-wrap': 'flexbox',
    'align-items': 'flexbox',
    'justify-content': 'flexbox',

    left: 'position',
    right: 'position',
    top: 'position',
    bottom: 'position',
};

const edgeCases = {
    display: {
        value: 'flex',
        module: 'flexbox'
    }
};

const modulesDict = {
    lineHeight: 'leading',
    color: 'textColors',
    fontSize: 'textSizes',
    fill: 'svgFill',
};

function getPropKeyFromRule (rule) {
    if (!rule) return;

    const prop = rule.first.prop;
    const value = rule.first.value;
    const edgeCase = edgeCases[prop];

    if (edgeCase && edgeCase.value === value) {
        return edgeCase.module;
    }

    const camelCasedProp = camelCase(propDict[prop] || prop);

    return modulesDict[camelCasedProp] || camelCasedProp;
}

module.exports = postcss.plugin('postcss-tailwind-comments', function () {
    return function (root) {
        root.walkRules(rule => {
            const key = getPropKeyFromRule(rule);
            const prevKey = getPropKeyFromRule(rule.prev());

            if (!prevKey) {
                rule.raws.before = `/* ${key} */\n`;
            } else if (prevKey !== key) {
                rule.raws.before = `\n/* ${key} */\n`;
            }
        });
    };
});
