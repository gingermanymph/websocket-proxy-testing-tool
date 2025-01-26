import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';

export function CodeEditor({ value, onChange, extensions, editable = true }) {
  return (
    <CodeMirror
      height='100%'
      value={value}
      extensions={extensions === 'javascript' ? [javascript({ jsx: true })] : [json()]}
      editable={editable}
      onChange={onChange}
      theme={material} />
  )
}