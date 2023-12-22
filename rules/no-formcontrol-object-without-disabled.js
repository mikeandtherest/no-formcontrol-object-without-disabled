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
