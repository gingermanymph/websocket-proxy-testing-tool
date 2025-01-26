import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';

export function CodeEditor({ value, onChange, extensions, editable = true }) {
  const beautifyJSON = (jsonString) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2) + '\n\n\n';
    } catch (e) {
      return jsonString + '\n\n\n';
    }
  }

  return (
    <CodeMirror
      height='100%'
      value={editable ? value : beautifyJSON(value)}
      extensions={extensions === 'javascript' ? [javascript({ jsx: true })] : [json()]}
      editable={editable}
      onChange={onChange}
      theme={material} />
  )
}