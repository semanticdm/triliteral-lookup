export default function Page({ params }: { params: { slug: string } }) {
  return <>Hello. {JSON.stringify(params.slug)}</>
}
