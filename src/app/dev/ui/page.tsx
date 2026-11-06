"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/providers/toast-provider";

const vehicleOptions = [
  { value: "ba-1-kha-1234", label: "BA 1 KHA 1234 — Truck" },
  { value: "ba-2-kha-5678", label: "BA 2 KHA 5678 — Tipper" },
  { value: "lu-1-kha-9012", label: "LU 1 KHA 9012 — Container" },
  { value: "ko-1-kha-3456", label: "KO 1 KHA 3456 — Tanker" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
      <Separator />
    </section>
  );
}

export default function UiDemoPage() {
  const { toast } = useToast();
  const [selectValue, setSelectValue] = useState<string>();
  const [comboboxValue, setComboboxValue] = useState<string>();
  const [checked, setChecked] = useState(false);
  const [switched, setSwitched] = useState(true);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">UI primitives</h1>
        <p className="text-sm text-slate-600">
          Phase 2 smoke test. Every component below is interactive and keyboard-accessible.
        </p>
      </header>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            +
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-name">Staff name</Label>
            <Input id="demo-name" placeholder="Enter name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-invalid">Mobile number</Label>
            <Input id="demo-invalid" aria-invalid placeholder="Invalid state" />
            <p className="text-xs text-rose-600">Enter a 10-digit number.</p>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="demo-notes">Load details</Label>
            <Textarea id="demo-notes" placeholder="Describe the load" />
          </div>
        </div>
      </Section>

      <Section title="Select & combobox">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Vehicle type</Label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="Select type…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="tipper">Tipper</SelectItem>
                <SelectItem value="container">Container</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Vehicle (searchable)</Label>
            <Combobox
              options={vehicleOptions}
              value={comboboxValue}
              onValueChange={setComboboxValue}
              placeholder="Select vehicle…"
              searchPlaceholder="Search plate…"
            />
          </div>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">In Job</Badge>
          <Badge variant="warning">Payment Pending</Badge>
          <Badge variant="destructive">Rejected</Badge>
          <Badge variant="info">In Queue</Badge>
          <Badge variant="muted">Unregistered</Badge>
        </div>
      </Section>

      <Section title="Loading">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>End journey?</DialogTitle>
                <DialogDescription>
                  This will close the queue entry for BA 1 KHA 1234. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">End journey</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Check in summary</DrawerTitle>
                <DrawerDescription>
                  Queue number, route, and checkpoint details appear here.
                </DrawerDescription>
              </DrawerHeader>
              <div className="text-sm text-slate-600">Body content…</div>
              <DrawerFooter>
                <Button>Confirm check in</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              Sthaniyasangh is the local association the vehicle is registered under.
            </TooltipContent>
          </Tooltip>
        </div>
      </Section>

      <Section title="Toggles">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="demo-checkbox"
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            />
            <Label htmlFor="demo-checkbox">Is Individual</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="demo-switch"
              checked={switched}
              onCheckedChange={setSwitched}
            />
            <Label htmlFor="demo-switch">Is Registered</Label>
          </div>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-job">In Job</TabsTrigger>
            <TabsTrigger value="in-queue">In Queue</TabsTrigger>
            <TabsTrigger value="payment">Payment Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="text-sm text-slate-600">
            All queue entries.
          </TabsContent>
          <TabsContent value="in-job" className="text-sm text-slate-600">
            Entries currently in job.
          </TabsContent>
          <TabsContent value="in-queue" className="text-sm text-slate-600">
            Entries waiting in queue.
          </TabsContent>
          <TabsContent value="payment" className="text-sm text-slate-600">
            Entries with payment pending.
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Toasts">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => toast("success", "Receipt INX_2083_001 issued.")}>
            Success toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => toast("error", "Could not end journey. Try again.")}
          >
            Error toast
          </Button>
          <Button variant="outline" onClick={() => toast("info", "Queue refreshed.")}>
            Info toast
          </Button>
        </div>
      </Section>
    </main>
  );
}