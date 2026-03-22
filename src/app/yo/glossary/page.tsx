import type { Metadata } from "next";
import { getAllEntries, getAllTags } from "@/lib/glossary";
import GlossaryIndex from "@/components/GlossaryIndex";

export const metadata: Metadata = {
    title: "Àkójọ Ọ̀rọ̀ — Imoifa",
    description:
        "Wo àkójọ Imoifa fún àwọn ọ̀rọ̀ Ifá àti Yorùbá ní abala ìmọ̀-ọgbọ́n, ẹ̀mí, àti àṣà.",
};

export default function YoGlossaryPage() {
    const entries = getAllEntries("yo");
    const allTags = getAllTags("yo");

    return (
        <GlossaryIndex
            entries={entries}
            allTags={allTags}
            locale="yo"
            heading="Àkójọ Ọ̀rọ̀"
            subheading="Ìtọ́kasí àwọn ọ̀rọ̀ Ifá àti Yorùbá ní abala ìmọ̀-ọgbọ́n, ẹ̀mí, àti àṣà."
            placeholder="Wá àwọn ọ̀rọ̀, ìtumọ̀, àwọn àmì…"
        />
    );
}
