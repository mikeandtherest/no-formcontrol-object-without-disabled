module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow FormControl initialization with only value field',
            category: 'Best Practices',
            recommended: false,
        },
        schema: [], // no options
        messages: {
            incompleteInitObject: 'FormControl initialized with value without disabled field.',
        },
    },
    create(context) {
        return {
            ArrayExpression(node) {
                let formGroupFound = false;
                let tmpNode = node;
                while (tmpNode.parent) {
                    if (tmpNode.parent?.type === 'CallExpression') {
                        const propName = tmpNode.parent?.callee?.property?.name?.toLowerCase();
                        if (propName && ['group', 'formgroup'].some(name => propName.indexOf(name) !== -1)) {
                            formGroupFound = true;
                            break;
                        }
                    }
                    tmpNode = tmpNode.parent;
                }
                if (!formGroupFound) { return; }
                if (node?.elements?.[0]?.type === 'ObjectExpression') {
                    const properties = node.elements[0].properties;
                    const hasValue = properties.some(property => property.key.name === 'value');
                    const hasDisabled = properties.some(property => property.key.name === 'disabled');

                    if (hasValue && !hasDisabled) {
                        // Report the issue
                        context.report({
                            node,
                            messageId: 'incompleteInitObject',
                        });
                    }
                }
            },
        };
    },
};
