import { Eye, Grid2X2, Image, LayoutPanelTop, Monitor, Smartphone, Type, Undo2, Redo2, Upload, Star, MessageCircleQuestion, PanelBottom, Minus, FormInput, MousePointerClick } from 'lucide-react';
import { Button, Card, Input } from './ui';

const sections = [
  { icon: LayoutPanelTop, label: 'Hero' },
  { icon: Type, label: 'Text' },
  { icon: Image, label: 'Image' },
  { icon: FormInput, label: 'Form' },
  { icon: Star, label: 'Benefits' },
  { icon: MessageCircleQuestion, label: 'Testimonials' },
  { icon: MessageCircleQuestion, label: 'FAQ' },
  { icon: PanelBottom, label: 'Footer' },
  { icon: Minus, label: 'Divider' },
];

export function BuilderPreview() {
  return (
    <div className="flex min-h-[960px] border-l border-slate-200 bg-white">
      <aside className="hidden w-36 border-r border-slate-200 bg-white p-3 lg:block">
        <h3 className="mb-4 font-bold">Add Section</h3>
        <div className="space-y-2">
          {sections.map((section) => (
            <button key={section.label} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs font-medium text-slate-600 hover:border-meta hover:text-meta">
              <span className="rounded border border-dashed border-slate-400 p-1"><section.icon className="h-5 w-5" /></span>
              {section.label}
            </button>
          ))}
        </div>
      </aside>
      <section className="flex-1 bg-[#fbfcff]">
        <div className="flex h-24 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <h2 className="text-xl font-bold">Landing Page & Redirect Builder</h2>
            <div className="mt-5 flex gap-7 text-sm font-semibold">
              <span className="border-b-2 border-meta pb-3 text-meta">Landing Page</span>
              <span className="pb-3 text-slate-500">Redirects</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="px-3"><Monitor className="h-4 w-4 text-meta" /></Button>
            <Button variant="secondary" className="px-3"><Smartphone className="h-4 w-4" /></Button>
            <Button variant="secondary"><Eye className="h-4 w-4" />Preview</Button>
            <Button>Publish</Button>
          </div>
        </div>
        <div className="px-6 py-7">
          <div className="mx-auto max-w-[650px]">
            <div className="mb-3 flex justify-center gap-3 text-slate-500">
              {[Undo2, Redo2, Eye, Upload, Grid2X2, MousePointerClick].map((Icon, index) => <button key={index} className="rounded-lg border border-slate-200 bg-white p-2"><Icon className="h-4 w-4" /></button>)}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="rounded-md bg-indigo-50 py-3 text-center text-xs font-medium text-slate-500">Header</div>
              <div className="relative mt-3 grid gap-4 rounded border-2 border-meta bg-white p-6 md:grid-cols-2">
                <span className="absolute right-2 top-[-18px] rounded bg-meta px-2 py-1 text-[10px] font-bold text-white">EDITING</span>
                <div className="space-y-4">
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-400">H1</span>
                  <div className="h-3 w-48 rounded bg-slate-300" />
                  <div className="h-3 w-36 rounded bg-slate-300" />
                  <div className="space-y-2">
                    <div className="h-1.5 w-52 rounded bg-slate-200" />
                    <div className="h-1.5 w-40 rounded bg-slate-200" />
                  </div>
                  <Button className="px-5">Primary CTA</Button>
                </div>
                <div className="flex min-h-44 items-center justify-center rounded border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
                  <svg viewBox="0 0 240 140" className="w-64 text-slate-300"><circle cx="185" cy="35" r="14" fill="currentColor" /><path d="M25 125 95 55l53 48 28-30 48 52H25Z" fill="currentColor" /></svg>
                </div>
              </div>
              <Card className="mt-4 p-8 text-center">
                <h3 className="mb-5 text-sm font-semibold text-slate-500">Benefits</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((item) => <div key={item} className="border-r last:border-r-0"><div className="mx-auto mb-4 h-10 w-10 rounded-full bg-indigo-100" /><div className="mx-auto h-2 w-20 rounded bg-slate-300" /><div className="mx-auto mt-2 h-2 w-16 rounded bg-slate-200" /></div>)}
                </div>
              </Card>
              <Card className="mt-4 p-6 text-center">
                <h3 className="mb-5 text-sm font-semibold text-slate-500">Form Section</h3>
                <div className="space-y-3"><Input placeholder="Full Name" /><Input placeholder="Email Address" /><Button className="w-full">Submit</Button></div>
              </Card>
              <div className="mt-4 rounded-md bg-indigo-50 py-4 text-center text-xs font-medium text-slate-500">Footer</div>
            </div>
          </div>
        </div>
      </section>
      <aside className="hidden w-64 border-l border-slate-200 bg-white xl:block">
        <div className="grid grid-cols-2 border-b border-slate-200 text-center text-sm font-semibold"><span className="border-b-2 border-meta py-4 text-meta">Settings</span><span className="py-4 text-slate-500">Styles</span></div>
        <div className="space-y-6 p-4 text-sm">
          <div><h4 className="mb-2 font-bold">Section</h4><label className="text-xs text-slate-500">ID</label><Input value="hero-01" /></div>
          <div><h4 className="mb-2 font-bold">Visibility</h4><div className="grid grid-cols-3 gap-2">{[Monitor, Smartphone, Eye].map((Icon, index) => <button key={index} className="rounded border border-slate-200 p-2"><Icon className="mx-auto h-4 w-4 text-slate-500" /></button>)}</div></div>
          <div className="space-y-3"><h4 className="font-bold">Layout</h4><label className="text-xs text-slate-500">Content Width</label><select className="w-full rounded border border-slate-200 px-3 py-2"><option>Contained</option></select><label className="text-xs text-slate-500">Columns</label><input type="range" className="w-full" defaultValue="50" /><label className="text-xs text-slate-500">Column Gap</label><input type="range" className="w-full" defaultValue="32" /></div>
          <div><h4 className="mb-3 font-bold">Background</h4><label className="text-xs text-slate-500">Color</label><div className="flex gap-2"><span className="h-9 w-9 rounded border bg-[#f6f7f9]" /><Input value="#F6F7F9" /></div><Button variant="secondary" className="mt-3 w-full text-meta">Choose image</Button></div>
          <div><h4 className="mb-3 font-bold">Spacing</h4><div className="grid grid-cols-3 gap-2 text-center"><Input value="24" /><Input value="80" /><Input value="24" /></div></div>
        </div>
      </aside>
    </div>
  );
}
