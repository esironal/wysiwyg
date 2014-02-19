'use strict';

function offset(tag, attr) {
  switch(tag) {
    case 'header':
      // ## Heading
      return [ attr.level + 1 ]; 
    case 'link':
      // todo
      return [ 0 ];
    case 'img':
      // todo
      return [ 0 ];
    case 'para': return [ 0 ];
    case 'inlinecode':
      // has a before ``` and after ``` - todo: add lang len to offset i.e. ```js
      return [ 3, 3 ];
    case 'code_block':
      // `npm install x` 
      return [ 1, 1 ];
    case 'bulletlist':
    case 'listitem':
      return [ 0 ];
    case 'strong':
      // **xxx**
      return [ 2, 2 ]; 
    case 'em':
      // *xxx*
      return [ 1, 1 ]; 
    default:
      return [ 0 ];
  }
}

module.exports = function offsetify(otree) {
  var totalOffset = 0
    , totalPos = 0;

  function walk(node) {
    function updateOffset(idx) {
      node.offset[idx] = node.offset[idx] || 0;
      totalOffset += node.offset[idx];
      node.totalOffset[idx] = totalOffset;
    }


    if (node.tag) {
      node.offset = offset(node.tag, node.attr);
      node.totalOffset = [];
      updateOffset(0);
    }     

    if (node.content) { 
      node.totalOffset = [ totalOffset, totalOffset ];

      node.totalPos = [ totalPos ];
      totalPos += node.content.length;
      node.totalPos[1] = totalPos;
    }
    if (node.children) node.children.forEach(walk);

    // add offset due to closers after evaluating children
    if (node.tag) updateOffset(1);
  }

  walk(otree);
  return otree;
}