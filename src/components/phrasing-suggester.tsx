'use client';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wand2, Loader2, Copy } from 'lucide-react';
import { suggestPhrasingAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';

type PhrasingSuggesterProps = {
  sectionType: 'Summary' | 'Project Description' | 'Achievement / Event' | 'Leadership';
  fieldName: string;
  context?: Record<string, string>;
};

export function PhrasingSuggester({
  sectionType,
  fieldName,
  context = {},
}: PhrasingSuggesterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const { getValues, setValue } = useFormContext();
  const { toast } = useToast();

  const handleSuggest = async () => {
    setIsLoading(true);
    setSuggestion('');
    try {
      const allData = getValues();
      const currentFieldValue = getValues(fieldName);

      const information = `
        Current Text: ${currentFieldValue}
        User's Skills: ${allData.skills}
        User's Summary: ${allData.summary}
        Section Context: ${JSON.stringify(context)}
      `;

      const result = await suggestPhrasingAction({
        sectionType,
        information,
      });

      if (result.success && result.data?.suggestedPhrasing) {
        setSuggestion(result.data.suggestedPhrasing);
      } else {
        throw new Error(result.error || 'Failed to get suggestion.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleReplace = () => {
    setValue(fieldName, suggestion, { shouldValidate: true, shouldDirty: true });
    toast({ title: 'Content replaced!' });
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSuggest}
          className="text-primary hover:text-primary"
        >
          <Wand2 />
          Suggest
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Suggestion</h4>
            <p className="text-sm text-muted-foreground">
              Use this suggestion to improve your resume.
            </p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                value={suggestion}
                readOnly
                className="h-32 text-sm"
              />
               <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy />
                </Button>
                <Button size="sm" onClick={handleReplace}>Replace</Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
