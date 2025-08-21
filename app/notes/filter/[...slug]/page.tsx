import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];

  return {
    title: `${tag}`,
    description: `Notes in ${tag} category`,
    openGraph: {
      title: ` ${tag}`,
      description: `Notes in ${tag} category`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Filtered Notes",
        },
      ],
    },
  };
}
export default async function NotesByFilter({ params }: Props) {
  const { slug } = await params;
  const tag: string = slug[0];

  const data = await fetchNotes({
    search: "",
    page: 1,
    ...(tag && tag !== "All" && { tag }),
  });

  return <NotesClient initialData={data} tag={tag} />;
}
