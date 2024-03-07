import { notFound } from "next/navigation"
import { Metadata } from "next"
import { allPages } from "contentlayer/generated"

import { Mdx } from "@/components/mdx-components"
import { elapsedTime } from "@/lib/date-utils"

interface PageProps {
  params: {
    slug: string[]
  }
}

async function getPageFromParams(params: PageProps["params"]) {
  const slug = params?.slug?.join("/")
  const page = allPages.find((page) => page.slugAsParams === slug)

  if (!page) {
    null
  }

  return page
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageFromParams(params)

  if (!page) {
    return {}
  }

  return {
    title: page.title,
    description: page.description,
  }
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }))
}

export default async function PagePage({ params }: PageProps) {
  const page = await getPageFromParams(params)
  if (!page) {
    notFound()
  }

  const isUpdated: boolean = !!page.lastUpdatedAt;
  return (
    <article className="py-6 prose dark:prose-invert">
      <h1>{page.title}</h1>
      {page.description && <p className="text-xl">{page.description}</p>}
      {isUpdated ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last updated: {elapsedTime(new Date(page.lastUpdatedAt ?? 0))}
        </p>
      ) : (
        page.createdAt && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Created at: {elapsedTime(new Date(page.createdAt))}
          </p>
        )
      )}
      <hr />
      <Mdx code={page.body.code} />
    </article>
  )
}
