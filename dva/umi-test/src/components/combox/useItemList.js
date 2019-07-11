import { useRef, useState } from 'react';

let itemListId = -1;

function getItemId(index) {
  return index === null ? null : `item-${index}`;
}

function useItemList(items, onSelect) {
  const listId = `menu-${useRef(itemListId + 1).current}`;
  const [index, setIndex] = useState(null);

  return {
    listId,
    highlightedIndex: index,
    setHighlightedIndex: setIndex,
    getControllerProps: () => ({
      onKeyDown: event => {
        if (event.key === 'ArrowUp') {
          const nextIndex = index - 1;
          setIndex(index === null ? items.length - 1 : nextIndex < 0 ? null : nextIndex);
        }

        if (event.key === 'ArrowDown') {
          const nextIndex = index + 1;
          setIndex(
            index === null
              ? 0
              : nextIndex > items.length - 1
              ? null
              : nextIndex,
          );
        }

        if (event.key === 'Enter') {
          onSelect(items[index]);
        }
      },
    }),

    getItemProps: itemIndex => ({
      key: itemIndex,
      id: getItemId(itemIndex),
      onMouseEnter: () => setIndex(itemIndex),
      onMouseLeave: () => setIndex(null),
      onClick: () => onSelect(items[itemIndex]),
    }),
  }
}

export { useItemList };
