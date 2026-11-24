import { createFileRoute, notFound } from "@tanstack/react-router";
import { findPage, pages } from "@/lib/course";
import { PageShell } from "@/components/lab/page-shell";
import {
  ContentCard,
  SectionHeader,
  ContentPlaceholder,
  CodeBlock,
  PlaceholderTag,
  NoteBox,
} from "@/components/lab/blocks";
import { FolderKanban, Database, Target, Cpu, CheckSquare } from "lucide-react";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const index = findPage(params.slug);
    if (index < 1) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? pages[loaderData.index] : undefined;
    const title = p
      ? `${p.title} · Hierarchical Clustering Lab`
      : "Unavailable · Hierarchical Clustering Lab";
    const description = p
      ? `${p.title} module of the Hierarchical Clustering Lab machine learning series.`
      : "Page not found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ModulePage,
});

function ModulePage() {
  const { index } = Route.useLoaderData();
  const page = pages[index]!;

  return (
    <PageShell index={index}>
      {/* Dedicated Project Listing UI for Hands-on Projects Module */}
      {page.slug === "projects" && (
        <div className="space-y-8">
          <ContentCard>
            <SectionHeader index={1} title="Capstone Projects Overview" />
            <div className="space-y-3">
              <ContentPlaceholder label="Project Curriculum & Learning Objectives" />
              <NoteBox title="Submission & Execution Guidelines">
                <span>
                  Each project provides a complete end-to-end unsupervised learning specification.
                  Datasets, problem parameters, and starter code will be populated in subsequent
                  development phases.
                </span>
              </NoteBox>
            </div>
          </ContentCard>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                id: 1,
                name: "Customer Behavioral Hierarchy & Persona Segmentation",
                dataset: "E-Commerce Transactional RFM Matrix",
                target: "Multilevel Customer Grouping",
              },
              {
                id: 2,
                name: "Biological Phylogeny Reconstruction from Genetic Distance",
                dataset: "Multidimensional Gene Expression Microarray",
                target: "Evolutionary Tree Topology",
              },
              {
                id: 3,
                name: "Hierarchical Document Topic Modeling & Taxonomy Mining",
                dataset: "Scientific Paper Abstract Corpus (TF-IDF)",
                target: "Sub-discipline Topic Hierarchy",
              },
              {
                id: 4,
                name: "Industrial Sensor Fleet Anomaly & Degradation Clustering",
                dataset: "Turbine Telemetry Time-Series Distance",
                target: "Failure Regime Discovery",
              },
            ].map((proj) => (
              <ContentCard key={proj.id} className="flex flex-col justify-between">
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                    <span className="font-mono text-xs font-semibold uppercase text-teal">
                      PROJECT 0{proj.id}
                    </span>
                    <PlaceholderTag variant="content">[CONTENT PLACEHOLDER]</PlaceholderTag>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-4">
                    [Project Title Placeholder]: {proj.name}
                  </h3>

                  <div className="space-y-4">
                    <div className="rounded-sm border border-border bg-secondary/30 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <Database className="h-3.5 w-3.5 text-teal" />
                        <span>Dataset: {proj.dataset}</span>
                      </div>
                      <ContentPlaceholder label="Dataset Specification" />
                    </div>

                    <div className="rounded-sm border border-border bg-secondary/30 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <Target className="h-3.5 w-3.5 text-teal" />
                        <span>Problem Statement: {proj.target}</span>
                      </div>
                      <ContentPlaceholder label="Problem Formulation" />
                    </div>

                    <div className="rounded-sm border border-border bg-secondary/30 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <Cpu className="h-3.5 w-3.5 text-teal" />
                        <span>Techniques Used</span>
                      </div>
                      <ContentPlaceholder label="Algorithmic Techniques" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground font-mono">
                        Implementation Blueprint
                      </span>
                      <CodeBlock label={`Project 0${proj.id} Starter Code`} />
                    </div>

                    <div className="rounded-sm border border-border bg-secondary/30 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <CheckSquare className="h-3.5 w-3.5 text-teal" />
                        <span>Expected Outcome</span>
                      </div>
                      <ContentPlaceholder label="Deliverables & Evaluation Criteria" />
                    </div>
                  </div>
                </div>
              </ContentCard>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
