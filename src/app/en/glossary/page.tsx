import type { Metadata } from "next";
import { getAllEntries, getAllTags } from "@/lib/glossary";
import GlossaryIndex from "@/components/GlossaryIndex";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Browse the Imoifa glossary of Ifá and Yorùbá philosophical, spiritual, and cultural terms.",
};

export default function GlossaryPage() {
  const entries = getAllEntries("en");
  const allTags = getAllTags("en");

  return (
    <GlossaryIndex
      entries={entries}
      allTags={allTags}
      locale="en"
      heading="Glossary"
      subheading="An indexed reference of Ifá and Yorùbá terminology, philosophy, and practice."
      placeholder="Search terms, definitions, tags…"
    />
  );
}
