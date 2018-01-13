Ext.define('A.other.ElementFix', {
    override: 'Ext.Element',
    syncContent: function(source) {
        source = Ext.getDom(source);

        //if (!source) return;
        var me = this,
            sourceNodes = source.childNodes,
            sourceLen = sourceNodes.length,
            dest = me.dom,
            destNodes = dest.childNodes,
            destLen = destNodes.length,
            i,  destNode, sourceNode,
            nodeType, newAttrs, attLen, attName;

        newAttrs = source.attributes;
        attLen = newAttrs.length;
        for (i = 0; i < attLen; i++) {
            attName = newAttrs[i].name;
            if (attName !== 'id') {
                dest.setAttribute(attName, newAttrs[i].value);
            }
        }

        // If the number of child nodes does not match, fall back to replacing innerHTML
        if (sourceLen !== destLen) {
            dest.innerHTML = source.innerHTML; // HERE
            return;
        }

        // Loop through source nodes.
        // If there are fewer, we must remove excess
        for (i = 0; i < sourceLen; i++) {
            sourceNode = sourceNodes[i];
            destNode = destNodes[i];
            nodeType = sourceNode.nodeType;

            // If node structure is out of sync, just drop innerHTML in and return
            if (nodeType !== destNode.nodeType || (nodeType === 1 && sourceNode.tagName !== destNode.tagName)) {
                dest.innerHTML = source.innerHTML;
                return;
            }

            // Update text node
            if (nodeType === 3) {
                destNode.data = sourceNode.data;
            }
            // Sync element content
            else {
                if (sourceNode.id && destNode.id !== sourceNode.id) {
                    destNode.id = sourceNode.id;
                }
                destNode.style.cssText = sourceNode.style.cssText;
                destNode.className = sourceNode.className;
                Ext.fly(destNode).syncContent(sourceNode);
            }
        }
    }
});