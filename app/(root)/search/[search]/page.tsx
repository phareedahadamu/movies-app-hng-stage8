import SearchResult from "@/components/SearchResults";
// interface Movie {
//   title: string;
//   backdrop_path: string;
//   id: string;
//   favourite: boolean;
//   bookmark: boolean;
// }
export default async function SearchResultPage({
  params,
}: {
  params: Promise<{ search: string }>;
}) {
  const { search } = await params;

  // console.log(query);

  return <SearchResult query={search} />;
}
