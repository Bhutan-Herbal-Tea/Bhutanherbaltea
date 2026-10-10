import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTea, otherTeas, teas } from "@/data/teas";
import { TeaDetail } from "../_components/TeaDetail";

// Only the five teas exist; any other slug is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return teas.map((tea) => ({ slug: tea.slug }));
}

export async function generateMetadata({ params }: PageProps<"/teas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tea = getTea(slug);
  if (!tea) return {};
  return { title: tea.name, description: tea.shortDescription };
}

export default async function TeaPage({ params }: PageProps<"/teas/[slug]">) {
  const { slug } = await params;
  const tea = getTea(slug);
  if (!tea) notFound();
  return <TeaDetail tea={tea} others={otherTeas(slug)} />;
}
