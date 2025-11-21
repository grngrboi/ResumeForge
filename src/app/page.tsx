'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, type ResumeSchema } from '@/lib/types';
import { initialData, initialSections } from '@/lib/initial-data';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { AppHeader } from '@/components/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const LOCAL_STORAGE_KEY = 'resume-data';
const LOCAL_STORAGE_SECTIONS_KEY = 'resume-sections';

const migrateData = (data: any) => {
  if (!data) return initialData;
  let migratedData = { ...data };
  if (!migratedData.references) {
    migratedData.references = initialData.references;
  }
  if (migratedData.events) {
    delete migratedData.events;
  }
  // Ensure all sections from initialData are present
  Object.keys(initialData).forEach(key => {
    if (!(key in migratedData)) {
      migratedData[key] = initialData[key as keyof typeof initialData];
    }
  });

  return migratedData;
};

const migrateSections = (sections: any) => {
    if (!sections) return initialSections;
    let parsedSections = [...sections];
    if (parsedSections.some((s: any) => s.id === 'events')) {
        parsedSections = parsedSections.filter((s:any) => s.id !== 'events');
    }
    if (!parsedSections.some((s: any) => s.id === 'references')) {
        parsedSections.push({ id: 'references', title: 'References' });
    }
    return parsedSections;
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  const [initialValues, setInitialValues] = useState<ResumeSchema>(initialData);
  const [initialSectionsState, setInitialSectionsState] = useState(initialSections);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedSections = localStorage.getItem(LOCAL_STORAGE_SECTIONS_KEY);
      
      const loadedData = savedData ? migrateData(JSON.parse(savedData)) : initialData;
      setInitialValues(loadedData);

      const loadedSections = savedSections ? migrateSections(JSON.parse(savedSections)) : initialSections;
      setInitialSectionsState(loadedSections);

    } catch (e) {
      console.error("Failed to load from local storage, using initial data.", e);
      setInitialValues(initialData);
      setInitialSectionsState(initialSections);
    }
  }, []);

  const formMethods = useForm<ResumeSchema>({
    resolver: zodResolver(resumeSchema),
    values: initialValues, // Use `values` to keep form in sync with state
    mode: 'onChange',
  });

  const [sections, setSections] = useState(initialSectionsState);
  const watchedData = formMethods.watch();

  useEffect(() => {
    // This effect updates the sections state when the initial sections are loaded from local storage
    setSections(initialSectionsState);
  }, [initialSectionsState]);

  useEffect(() => {
    if (isClient) {
      try {
        const _json = JSON.stringify(watchedData);
        localStorage.setItem(LOCAL_STORAGE_KEY, _json);
      } catch (e) {
        console.error("Failed to save data to local storage", e);
      }
    }
  }, [watchedData, isClient]);
  
  useEffect(() => {
    if (isClient) {
        try {
            const _json = JSON.stringify(sections);
            localStorage.setItem(LOCAL_STORAGE_SECTIONS_KEY, _json);
        } catch (e) {
            console.error("Failed to save sections to local storage", e);
        }
    }
  }, [sections, isClient]);

  const handleReset = () => {
    const previousData = formMethods.getValues();
    const previousSections = [...sections];

    formMethods.reset(initialData);
    setSections(initialSections);
    setInitialValues(initialData); // Also reset the initialValues state
    setInitialSectionsState(initialSections); // And the initial sections state

    toast({
      title: 'Resume Reset',
      description: 'Your resume has been reset to the default state.',
      action: (
        <Button
          variant="secondary"
          onClick={() => {
            formMethods.reset(previousData);
            setSections(previousSections);
            setInitialValues(previousData); // Restore previous data
            setInitialSectionsState(previousSections);
            toast({
              title: 'Undo Successful',
              description: 'Your resume has been restored.',
            });
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <FormProvider {...formMethods}>
      <div className="min-h-screen bg-background text-foreground print-visible">
        <AppHeader onReset={handleReset}/>
        <main className="grid h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-2">
          <ScrollArea className="h-full no-print">
            <div className="p-4 sm:p-6 lg:p-8">
              <ResumeForm sections={sections} setSections={setSections} />
            </div>
          </ScrollArea>
          <aside className="h-full hidden bg-secondary/50 md:block print:block print:bg-white">
            <ScrollArea className="h-full">
              <div
                id="resume-preview-container"
                className="p-8 origin-top print:scale-100"
              >
                <div className="print-container">
                  <ResumePreview data={watchedData} sections={sections} />
                </div>
              </div>
            </ScrollArea>
          </aside>
        </main>
      </div>
    </FormProvider>
  );
}
