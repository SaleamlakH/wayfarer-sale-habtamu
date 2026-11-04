import { useState, type ReactNode } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Spinner } from "../components/ui/Spinner";
import { Star } from "../components/ui/Star";
import { Textarea } from "../components/ui/Textarea";

const examplePlaces = [
  { name: "National Museum", category: "Historical", rating: 4.8 },
  { name: "Entoto Park", category: "Nature", rating: 4.6 },
  { name: "Holy Trinity Cathedral", category: "Cultural", rating: 4.5 },
  { name: "Unity Park", category: "Nature", rating: 4.7 },
];

interface PanelProps {
  title: string;
  children: ReactNode;
}

function Panel({ title, children }: PanelProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-(--ink-muted)">
        {title}
      </h2>
      {children}
    </Card>
  );
}

export function DesignPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="m-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Design components</h1>
        <p className="mt-1 text-sm text-(--ink-muted)">
          Development-only gallery for the shared UI components.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button disabled>
              <Spinner />
              Loading
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Panel>

        <Panel title="Spinner">
          <div className="flex items-center gap-4 text-(--accent)">
            <Spinner />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
          </div>
        </Panel>

        <Panel title="Form controls">
          <div className="flex flex-col gap-4">
            <Field label="Name" htmlFor="design-name">
              <Input id="design-name" placeholder="Amina" />
            </Field>
            <Field
              label="Email"
              htmlFor="design-email"
              hint="Used only to demonstrate the hint text."
            >
              <Input
                id="design-email"
                type="email"
                placeholder="amina@example.com"
              />
            </Field>
            <Field label="Role" htmlFor="design-role">
              <Select id="design-role" className="w-full" defaultValue="traveller">
                <option value="traveller">Traveller</option>
                <option value="guide">Guide</option>
              </Select>
            </Field>
            <Field
              label="Review"
              htmlFor="design-review"
              error="Review text is required."
            >
              <Textarea
                id="design-review"
                rows={3}
                placeholder="Write your review..."
              />
            </Field>
          </div>
        </Panel>

        <Panel title="States">
          <div className="flex flex-col gap-3">
            <Card
              nested
              className="flex flex-col items-center justify-center gap-3 p-8 text-sm text-(--ink-muted)"
            >
              <Spinner />
              Loading places
            </Card>
            <Card
              nested
              className="p-8 text-center text-sm text-(--ink-muted)"
            >
              No places found for this category.
            </Card>
            <Card nested className="p-4">
              <p role="alert" className="text-sm text-(--danger)">
                Could not load places. Please try again.
              </p>
            </Card>
          </div>
        </Panel>

        <Panel title="Card">
          <div className="flex flex-col gap-3">
            {examplePlaces.map((place) => (
              <Card
                key={place.name}
                nested
                className="flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-(--ink)">
                    {place.name}
                  </span>
                  <span className="text-xs text-(--ink-muted)">
                    {place.category}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm">
                  <Star />
                  <span className="text-(--ink)">
                    {Number.isInteger(place.rating)
                      ? place.rating
                      : place.rating.toFixed(1)}
                  </span>
                </span>
              </Card>
            ))}
          </div>
        </Panel>

        <Panel title="Modal">
          <div>
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          </div>
        </Panel>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ariaLabel="Example modal"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold">Example modal</h2>
            <Button
              variant="secondary"
              className="px-2 py-1 text-(--ink-muted)"
              onClick={() => setModalOpen(false)}
            >
              Close
            </Button>
          </div>
          <p className="text-sm text-(--ink-muted)">
            Modal is only a wrapper. All content is composed at usage.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
