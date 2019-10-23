import Quill from 'quill';
import EmojiBlot from './format-emoji-blot';
// import ShortNameEmoji from './module-emoji';
import ToolbarEmoji from './module-toolbar-emoji';
// import TextAreaEmoji from './module-textarea-emoji';
import '@/assets/emoji-test/quill-emoji.scss';

Quill.register({
    'formats/emoji': EmojiBlot,
    // 'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    // 'modules/emoji-textarea': TextAreaEmoji
}, true);
// , TextAreaEmoji, ShortNameEmoji
export default {EmojiBlot, ToolbarEmoji};