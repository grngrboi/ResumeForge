'use client';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { PhrasingSuggester } from './phrasing-suggester';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DndSection } from './dnd-section';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';

const SectionCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
);

export function ResumeForm({ sections, setSections }: { sections: any[], setSections: (sections: any[]) => void}) {
  const { control, getValues, watch } = useFormContext();

  const fontSize = watch('styling.fontSize', '1rem');

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
    move: moveProject,
  } = useFieldArray({ control, name: 'projects' });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
    move: moveAchievement,
  } = useFieldArray({ control, name: 'achievements' });

  const {
    fields: leadershipFields,
    append: appendLeadership,
    remove: removeLeadership,
    move: moveLeadership,
  } = useFieldArray({ control, name: 'leadershipAndVolunteering' });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
    move: moveEducation,
  } = useFieldArray({ control, name: 'education' });
  
  const {
    fields: certificateFields,
    append: appendCertificate,
    remove: removeCertificate,
    move: moveCertificate,
  } = useFieldArray({ control, name: 'certificates' });

  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
    move: moveReference,
  } = useFieldArray({ control, name: 'references' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleInnerDragEnd(event: DragEndEvent, moveFn: (from: number, to: number) => void) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = Number(String(active.id).split('-').pop());
      const newIndex = Number(String(over.id).split('-').pop());
      moveFn(oldIndex, newIndex);
    }
  }
  
  const sectionComponents: Record<string, React.ReactNode> = {
    summary: (
      <DndSection id="summary" key="summary">
        <SectionCard title="PROFESSIONAL SUMMARY" description="A brief, powerful summary of your career.">
            <FormField control={control} name="summary" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Summary</FormLabel>
                    <PhrasingSuggester sectionType="Summary" fieldName="summary" />
                  </div>
                  <FormControl><Textarea placeholder="Results-driven software engineer..." {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
        </SectionCard>
      </DndSection>
    ),
    projects: (
      <DndSection id="projects" key="projects">
        <SectionCard title="PROJECTS" description="Showcase your personal or professional projects.">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleInnerDragEnd(e, moveProject)} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <SortableContext items={projectFields.map((f, i) => `project-${i}`)} strategy={verticalListSortingStrategy}>
              <Accordion type="multiple" defaultValue={['project-item-0']} className="w-full">
              {projectFields.map((field, index) => (
                <DndSection key={field.id} id={`project-${index}`}>
                  <AccordionItem value={`project-item-${index}`}>
                    <div className="flex w-full items-center">
                      <AccordionTrigger className="flex-1">
                        <span>{getValues(`projects.${index}.name`) || `Project #${index + 1}`}</span>
                      </AccordionTrigger>
                      <Button variant="ghost" size="icon" onClick={() => removeProject(index)} className="hover:text-destructive ml-2">
                        <Trash2 />
                      </Button>
                    </div>
                    <AccordionContent className="p-4 space-y-4">
                        <FormField control={control} name={`projects.${index}.name`} render={({ field }) => <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField control={control} name={`projects.${index}.role`} render={({ field }) => <FormItem><FormLabel>Your Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                          <FormField control={control} name={`projects.${index}.period`} render={({ field }) => <FormItem><FormLabel>Project Period</FormLabel><FormControl><Input placeholder="e.g., 2023-Present or Jan 2023 - Mar 2023" {...field} /></FormControl><FormMessage /></FormItem>} />
                        </div>
                        <FormField
                            control={control}
                            name={`projects.${index}.projectType`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Project Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a project type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Self-Project">Self-Project</SelectItem>
                                        <SelectItem value="Client Project">Client Project</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={control} name={`projects.${index}.preview`} render={({ field }) => <FormItem><FormLabel>Preview</FormLabel><FormControl><Input placeholder="https:// or description" {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={control} name={`projects.${index}.description`} render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Description</FormLabel>
                              <PhrasingSuggester sectionType="Project Description" fieldName={`projects.${index}.description`} context={{projectName: getValues(`projects.${index}.name`), projectRole: getValues(`projects.${index}.role`)}} />
                            </div>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                    </AccordionContent>
                  </AccordionItem>
                </DndSection>
              ))}
              </Accordion>
            </SortableContext>
          </DndContext>
           <Button variant="outline" className="mt-4" onClick={() => appendProject({ name: '', role: '', period: '', description: '', preview: '', projectType: '' })}>
             <PlusCircle /> Add Project
           </Button>
        </SectionCard>
      </DndSection>
    ),
    achievements: (
      <DndSection id="achievements" key="achievements">
        <SectionCard title="ACHIEVEMENTS" description="Highlight your key accomplishments.">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleInnerDragEnd(e, moveAchievement)} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <SortableContext items={achievementFields.map((f, i) => `achievement-${i}`)} strategy={verticalListSortingStrategy}>
              <Accordion type="multiple" defaultValue={['achievement-item-0']} className="w-full">
              {achievementFields.map((field, index) => (
                <DndSection key={field.id} id={`achievement-${index}`}>
                  <AccordionItem value={`achievement-item-${index}`}>
                    <div className="flex w-full items-center">
                      <AccordionTrigger className="flex-1">
                        <span>{getValues(`achievements.${index}.achievement`)?.substring(0,30) || `Achievement #${index + 1}`}</span>
                      </AccordionTrigger>
                      <Button variant="ghost" size="icon" onClick={() => removeAchievement(index)} className="hover:text-destructive ml-2">
                        <Trash2 />
                      </Button>
                    </div>
                    <AccordionContent className="p-4 space-y-4">
                        <FormField control={control} name={`achievements.${index}.achievement`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Achievement</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField control={control} name={`achievements.${index}.event`} render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event (Optional)</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={control} name={`achievements.${index}.date`} render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date (Optional)</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={control} name={`achievements.${index}.description`} render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Description</FormLabel>
                              <PhrasingSuggester sectionType="Achievement / Event" fieldName={`achievements.${index}.description`} context={{event: getValues(`achievements.${index}.achievement`)}} />
                            </div>
                            <FormControl><Textarea {...field} rows={2} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                    </AccordionContent>
                  </AccordionItem>
                </DndSection>
              ))}
              </Accordion>
            </SortableContext>
          </DndContext>
           <Button variant="outline" className="mt-4" onClick={() => appendAchievement({ achievement: '', event: '', date: '', description: '' })}>
             <PlusCircle /> Add Achievement
           </Button>
        </SectionCard>
      </DndSection>
    ),
    leadership: (
      <DndSection id="leadership" key="leadership">
        <SectionCard title="LEADERSHIP AND VOLUNTEERING" description="Showcase your leadership and community involvement.">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleInnerDragEnd(e, moveLeadership)} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <SortableContext items={leadershipFields.map((f, i) => `leadership-${i}`)} strategy={verticalListSortingStrategy}>
              <Accordion type="multiple" defaultValue={['leadership-item-0']} className="w-full">
              {leadershipFields.map((field, index) => (
                <DndSection key={field.id} id={`leadership-${index}`}>
                  <AccordionItem value={`leadership-item-${index}`}>
                    <div className="flex w-full items-center">
                      <AccordionTrigger className="flex-1">
                        <span>{getValues(`leadershipAndVolunteering.${index}.organization`) || `Leadership #${index + 1}`}</span>
                      </AccordionTrigger>
                      <Button variant="ghost" size="icon" onClick={() => removeLeadership(index)} className="hover:text-destructive ml-2">
                        <Trash2 />
                      </Button>
                    </div>
                    <AccordionContent className="p-4 space-y-4">
                        <FormField control={control} name={`leadershipAndVolunteering.${index}.organization`} render={({ field }) => <FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField control={control} name={`leadershipAndVolunteering.${index}.role`} render={({ field }) => <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                          <FormField control={control} name={`leadershipAndVolunteering.${index}.date`} render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date (Optional)</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={control} name={`leadershipAndVolunteering.${index}.description`} render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Description</FormLabel>
                              <PhrasingSuggester sectionType="Leadership" fieldName={`leadershipAndVolunteering.${index}.description`} context={{organization: getValues(`leadershipAndVolunteering.${index}.organization`), role: getValues(`leadershipAndVolunteering.${index}.role`)}} />
                            </div>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                    </AccordionContent>
                  </AccordionItem>
                </DndSection>
              ))}
              </Accordion>
            </SortableContext>
          </DndContext>
           <Button variant="outline" className="mt-4" onClick={() => appendLeadership({ organization: '', role: '', description: '', date: '' })}>
             <PlusCircle /> Add Leadership/Volunteering
           </Button>
        </SectionCard>
      </DndSection>
    ),
    education: (
      <DndSection id="education" key="education">
        <SectionCard title="EDUCATION" description="Your academic background.">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleInnerDragEnd(e, moveEducation)} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <SortableContext items={educationFields.map((f, i) => `education-${i}`)} strategy={verticalListSortingStrategy}>
              <Accordion type="multiple" defaultValue={['education-item-0']} className="w-full">
              {educationFields.map((field, index) => (
                <DndSection key={field.id} id={`education-${index}`}>
                  <AccordionItem value={`education-item-${index}`}>
                    <div className="flex w-full items-center">
                      <AccordionTrigger className="flex-1">
                        <span>{getValues(`education.${index}.school`) || `Education #${index + 1}`}</span>
                      </AccordionTrigger>
                      <Button variant="ghost" size="icon" onClick={() => removeEducation(index)} className="hover:text-destructive ml-2">
                        <Trash2 />
                      </Button>
                    </div>
                    <AccordionContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField control={control} name={`education.${index}.degree`} render={({ field }) => <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                          <FormField control={control} name={`education.${index}.school`} render={({ field }) => <FormItem><FormLabel>School</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                          <FormField control={control} name={`education.${index}.location`} render={({ field }) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                          <FormField control={control} name={`education.${index}.graduationDate`} render={({ field }) => <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input type="text" placeholder="e.g., May 2019" {...field} /></FormControl><FormMessage /></FormItem>} />
                          <FormField control={control} name={`education.${index}.cgpa`} render={({ field }) => <FormItem><FormLabel>CGPA/Result</FormLabel><FormControl><Input placeholder="e.g. 3.8/4.0" {...field} /></FormControl><FormMessage /></FormItem>} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </DndSection>
              ))}
              </Accordion>
            </SortableContext>
          </DndContext>
           <Button variant="outline" className="mt-4" onClick={() => appendEducation({ degree: '', school: '', location: '', graduationDate: '', cgpa: '' })}>
             <PlusCircle /> Add Education
           </Button>
        </SectionCard>
      </DndSection>
    ),
    skills: (
      <DndSection id="skills" key="skills">
        <SectionCard title="SKILLS" description="List your technical and soft skills.">
            <div className="space-y-4">
            <FormField control={control} name="skills.technicalSkills" render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skills</FormLabel>
                <FormControl><Textarea placeholder="JavaScript, React, Team Leadership..." {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="skills.softSkills" render={({ field }) => (
                <FormItem>
                    <FormLabel>Skills / Soft skills</FormLabel>
                    <FormControl><Textarea placeholder="Communication, Teamwork, Problem Solving..." {...field} rows={2} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="skills.language" render={({ field }) => (
                <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl><Textarea placeholder="English (Native), Spanish (Conversational)..." {...field} rows={1} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            </div>
        </SectionCard>
      </DndSection>
    ),
    certificates: (
        <DndSection id="certificates" key="certificates">
            <SectionCard title="CERTIFICATE OF COMPLETION" description="Showcase your certifications.">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleInnerDragEnd(e, moveCertificate)} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                    <SortableContext items={certificateFields.map((f, i) => `certificate-${i}`)} strategy={verticalListSortingStrategy}>
                        <Accordion type="multiple" defaultValue={['certificate-item-0']} className="w-full">
                            {certificateFields.map((field, index) => (
                                <DndSection key={field.id} id={`certificate-${index}`}>
                                    <AccordionItem value={`certificate-item-${index}`}>
                                        <div className="flex w-full items-center">
                                            <AccordionTrigger className="flex-1">
                                                <span>{getValues(`certificates.${index}.name`)?.substring(0, 30) || `Certificate #${index + 1}`}</span>
                                            </AccordionTrigger>
                                            <Button variant="ghost" size="icon" onClick={() => removeCertificate(index)} className="hover:text-destructive ml-2">
                                                <Trash2 />
                                            </Button>
                                        </div>
                                        <AccordionContent className="p-4 space-y-4">
                                            <FormField control={control} name={`certificates.${index}.name`} render={({ field }) => <FormItem><FormLabel>Certificate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField control={control} name={`certificates.${index}.issuingOrganization`} render={({ field }) => <FormItem><FormLabel>Issuing Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                                <FormField control={control} name={`certificates.${index}.date`} render={({ field }) => <FormItem><FormLabel>Date (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </DndSection>
                            ))}
                        </Accordion>
                    </SortableContext>
                </DndContext>
                <Button variant="outline" className="mt-4" onClick={() => appendCertificate({ name: '', issuingOrganization: '', date: '' })}>
                    <PlusCircle /> Add Certificate
                </Button>
            </SectionCard>
        </DndSection>
    ),
    references: (
        <DndSection id="references" key="references">
            <SectionCard title="REFERENCES" description="Provide references upon request.">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleInnerDragEnd(e, moveReference)} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                    <SortableContext items={referenceFields.map((f, i) => `reference-${i}`)} strategy={verticalListSortingStrategy}>
                        <Accordion type="multiple" defaultValue={['reference-item-0']} className="w-full">
                            {referenceFields.map((field, index) => (
                                <DndSection key={field.id} id={`reference-${index}`}>
                                    <AccordionItem value={`reference-item-${index}`}>
                                        <div className="flex w-full items-center">
                                            <AccordionTrigger className="flex-1">
                                                <span>{getValues(`references.${index}.name`) || `Reference #${index + 1}`}</span>
                                            </AccordionTrigger>
                                            <Button variant="ghost" size="icon" onClick={() => removeReference(index)} className="hover:text-destructive ml-2">
                                                <Trash2 />
                                            </Button>
                                        </div>
                                        <AccordionContent className="p-4 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField control={control} name={`references.${index}.name`} render={({ field }) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                                <FormField control={control} name={`references.${index}.contact`} render={({ field }) => <FormItem><FormLabel>Contact</FormLabel><FormControl><Input placeholder="Email or Phone" {...field} /></FormControl><FormMessage /></FormItem>} />
                                            </div>
                                            <FormField control={control} name={`references.${index}.relation`} render={({ field }) => <FormItem><FormLabel>Relation</FormLabel><FormControl><Input placeholder="e.g., Former Manager at Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </DndSection>
                            ))}
                        </Accordion>
                    </SortableContext>
                </DndContext>
                <Button variant="outline" className="mt-4" onClick={() => appendReference({ name: '', contact: '', relation: '' })}>
                    <PlusCircle /> Add Reference
                </Button>
            </SectionCard>
        </DndSection>
    ),
  };

  return (
    <div className="space-y-6">
      <SectionCard title="PERSONAL DETAILS" description="Let's start with the basics.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={control} name="personal.name" render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="Alex Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="personal.email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="alex.doe@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="personal.phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input placeholder="123-456-7890" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={control} name="personal.location" render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input placeholder="New York, NY" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="sm:col-span-2">
            <FormField control={control} name="personal.linkedin" render={({ field }) => (
                <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="APPEARANCE" description="Customize the look of your resume.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
                control={control}
                name="styling.fontFamily"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={control}
              name="styling.fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Size: {fontSize}</FormLabel>
                  <FormControl>
                    <Input 
                      type="range"
                      min="0.8" max="1.2" step="0.05"
                      {...field}
                      onChange={(e) => field.onChange(`${e.target.value}rem`)}
                      value={fontSize.replace('rem', '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={control}
                name="styling.textAlign"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Text Align</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select text alignment" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="justify">Justify</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="mt-6">
            <FormField
              control={control}
              name="styling.lineHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line Height: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1.2} max={2} step={0.1}
                      defaultValue={[1.5]}
                      onValueChange={(value) => field.onChange(String(value[0]))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
      </SectionCard>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          {sections.map(section => sectionComponents[section.id])}
        </SortableContext>
      </DndContext>
    </div>
  );
}
