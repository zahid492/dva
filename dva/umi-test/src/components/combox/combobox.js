import React, {useState} from 'react';
import { Portal } from '../components/portal';
import { useFocusManager } from '@/components/useFocusManager';
import { useItemList } from '@/components/useItemList';


function Combobox({ items, value, onChange, onSelect }) {
  const filteredItems = items.filter(item => !value || item.includes(value))
  const { focused, handleFocus, handleBlur } = useFocusManager()
  const {
    listId,
    highlightedIndex,
    getControllerProps,
    getItemProps,
  } = useItemList(filteredItems, onSelect)
  return (
    <>
      <input
        {...getControllerProps()}
        aria-autocomplete="list"
        value={value}
        onChange={onChange}

        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {focused && (
        <Portal>
          <div
            id={listId}
            role="listbox"
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {filteredItems.map((item, itemIndex) => (
              <div
                {...getItemProps(itemIndex)}
                role="option"
                aria-selected={false}
                style={{
                  padding: 8,
                  backgroundColor:
                    highlightedIndex === itemIndex ? 'pink' : 'transparent',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </>
  )
}

const items = [
  'apple',
  'orange',
  'banana',
  'pear',
  'grape',
  'kiwi',
  'pineapple',
];

function IndexPage() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      items={items}
      value={value}
      onChange={event=>setValue(event.target.value)}
      onSelect={setValue}
    />
  )

}

export default IndexPage;
