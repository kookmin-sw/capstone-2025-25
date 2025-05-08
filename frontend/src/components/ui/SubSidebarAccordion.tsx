import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';

type SubSidebarAccordionProps = {
  value: string;
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export function SubSidebarAccordion({
  value,
  icon,
  title,
  children,
}: SubSidebarAccordionProps) {
  return (
    <Accordion type="single" collapsible defaultValue={value}>
      <AccordionItem value={value}>
        <AccordionTrigger className="hover:no-underline cursor-pointer">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-[18px] font-semibold">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-2.5">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
