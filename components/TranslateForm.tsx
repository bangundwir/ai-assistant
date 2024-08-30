'use client';

import { useState } from 'react';
import { TranslateFormProps } from '../types';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Italian">Italian</SelectItem>
            <SelectItem value="Portuguese">Portuguese</SelectItem>
            <SelectItem value="Russian">Russian</SelectItem>
            <SelectItem value="Japanese">Japanese</SelectItem>
            <SelectItem value="Chinese">Chinese</SelectItem>
            <SelectItem value="Korean">Korean</SelectItem>
            <SelectItem value="Indonesian">Indonesian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="context">Context</Label>
        <Textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="text">Text*</Label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full"
          rows={5}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="allowImprovisation"
          checked={allowImprovisation}
          onCheckedChange={(checked) => setAllowImprovisation(checked as boolean)}
        />
        <Label htmlFor="allowImprovisation">Allow improvisation</Label>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </form>
  );
};

export default TranslateForm;
