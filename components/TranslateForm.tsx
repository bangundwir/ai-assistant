'use client';

import { useState } from 'react';
import { TranslateFormProps } from '../types';

const TranslateForm: React.FC<TranslateFormProps> = ({ onTranslate, isLoading }) => {
  const [language, setLanguage] = useState('English');
  const [context, setContext] = useState('');
  const [text, setText] = useState('');
  const [allowImprovisation, setAllowImprovisation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTranslate(text, language, context);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="language" className="block mb-2">Language</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
          <option>Italian</option>
          <option>Portuguese</option>
          <option>Russian</option>
          <option>Japanese</option>
          <option>Chinese</option>
          <option>Korean</option>
        </select>
      </div>
      <div>
        <label htmlFor="context" className="block mb-2">Context</label>
        <textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="text" className="block mb-2">Text*</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows={5}
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="allowImprovisation"
          checked={allowImprovisation}
          onChange={(e) => setAllowImprovisation(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="allowImprovisation">Allow improvisation</label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
};

export default TranslateForm;
