export interface TranslateFormProps {
  onTranslate: (text: string, language: string, context: string) => void;
  isLoading: boolean;
}
