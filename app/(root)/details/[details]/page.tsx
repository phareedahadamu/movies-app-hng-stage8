import DetailsPage from "@/components/DetailsPage";
export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ details: string }>;
}) {
  const { details } = await params;
  // console.log(details);
  return <DetailsPage movieId={details} />;
}
