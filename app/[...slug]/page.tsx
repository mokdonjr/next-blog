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

  if (params.slug[0] === "resume" || params.slug[0] === "portfolio") {
    return (
      <article className="py-6 prose dark:prose-invert">
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
        <div className="flex items-center justify-between">
          <div className="flex-col justify-start">
            <h1 className="flex">{page.title}</h1>
            <div className="flex space-x-2">
              <span className="text-lg font-medium text-slate-500 dark:text-slate-400">
                6+
              </span>
              <span className=" text-slate-500 dark:text-slate-400">
                Years.
              </span>
            </div>
            <div className="flex space-x-2">
              <span className="text-lg font-medium text-slate-500 dark:text-slate-400">
                Back End Engineer
              </span>
            </div>
          </div>
          
          <div className="flex justify-end text-sm text-slate-500 dark:text-slate-400">
            <ul>
              <li>
                Email: mokdonjr@gmail.com
              </li>
              <li>
                Web: <a className="text-slate-500 dark:text-slate-400" href="https://blog.erenbaek.com">blog.erenbaek.com</a>
              </li>
              <li>
                LinkedIn: <a className="text-slate-500 dark:text-slate-400" href="https://linkedin.com/in/erenbaek">linkedin.com/in/erenbaek</a>
              </li>
            </ul>
          </div>
        </div>
        
        {page.description && <p className="text-xl">{page.description}</p>}
        <Mdx code={page.body.code} />
      </article>
    )
  }
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
