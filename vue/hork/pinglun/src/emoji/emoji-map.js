import emojiList from "./emoji-lis";

const emojiMap = {};

emojiList.forEach((emojiListObject) => {
    emojiMap[emojiListObject.name] = emojiListObject;
});

export default emojiMap;