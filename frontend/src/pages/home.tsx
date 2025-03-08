import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="p-6 space-y-10">
      {/* 기본 버튼 variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">기본 Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="black">Default Button</Button>
          <Button variant="white">White Button</Button>
          <Button variant="primary">Primary Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </div>

      {/* shadcn/ui 기본 variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">shadcn/ui Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  );
}
