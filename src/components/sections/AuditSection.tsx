import { motion } from 'framer-motion';
import { AUDIT_DOCUMENTS } from '@/data/pid-data';
import {
  FileText,
  FileJson,
  FileCheck,
  Download,
  CheckCircle2,
  PenLine,
} from 'lucide-react';

const FORMAT_ICONS: Record<string, typeof FileText> = {
  DOCX: FileText,
  JSON: FileJson,
  PDF: FileCheck,
};

export function AuditSection() {
  return (
    <section
      id="audit"
      className="relative w-full bg-[hsl(210_20%_4%)] py-32"
    >
      <div className="absolute inset-0 eng-grid opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-[hsl(185_85%_50%)] uppercase">
            Section 06
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Audit Package
          </h2>
          <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            HRIDAY generates a complete, audit-ready isolation package. Every
            document carries the full evidence trail — from source drawing
            coordinates to confidence scores — ready for engineer sign-off.
          </p>
        </motion.div>

        {/* Document grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {AUDIT_DOCUMENTS.map((doc, i) => {
            const Icon = FORMAT_ICONS[doc.format] || FileText;
            return (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative overflow-hidden rounded-lg border border-border bg-[hsl(210_20%_5%)] transition-all hover:border-[hsl(185_85%_50%_/_0.3)]"
              >
                {/* Document processing animation overlay */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute left-0 right-0 h-px bg-[hsl(185_85%_50%_/_0.3)]"
                    initial={{ top: '0%' }}
                    whileInView={{ top: '100%' }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                {/* Card content */}
                <div className="relative p-6">
                  {/* Icon + format badge */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-[hsl(210_20%_6%)]">
                      <Icon className="h-6 w-6 text-[hsl(185_85%_50%)]" />
                    </div>
                    <span className="rounded-sm border border-[hsl(160_70%_42%_/_0.3)] bg-[hsl(160_70%_42%_/_0.08)] px-2.5 py-1 font-mono text-[10px] font-medium text-[hsl(160_70%_42%)]">
                      {doc.format}
                    </span>
                  </div>

                  {/* Document name */}
                  <h3 className="mb-2 text-base font-medium text-white">
                    {doc.name}
                  </h3>

                  {/* Description */}
                  <p className="mb-5 text-sm font-light leading-relaxed text-muted-foreground">
                    {doc.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[hsl(160_70%_42%)]" />
                      <span className="font-mono text-xs text-[hsl(160_70%_42%)]">
                        Ready
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {doc.size}
                    </span>
                  </div>

                  {/* Download button */}
                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-[hsl(185_85%_50%_/_0.3)] hover:text-white">
                    <Download className="h-3.5 w-3.5" />
                    Download Package
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sign-off status bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-[hsl(160_70%_42%_/_0.2)] bg-[hsl(160_70%_42%_/_0.03)] p-6 sm:flex-row"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[hsl(160_70%_42%_/_0.3)] bg-[hsl(160_70%_42%_/_0.08)]">
              <PenLine className="h-6 w-6 text-[hsl(160_70%_42%)]" />
            </div>
            <div>
              <p className="text-base font-medium text-white">
                Ready for Engineer Sign-Off
              </p>
              <p className="mt-0.5 text-sm font-light text-muted-foreground">
                All documents generated. Evidence manifest complete. Awaiting
                qualified engineer verification.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              PKG-SIH26117-ISO-001
            </span>
            <span className="h-8 w-px bg-border" />
            <span className="rounded-sm border border-[hsl(160_70%_42%_/_0.3)] bg-[hsl(160_70%_42%_/_0.08)] px-3 py-1.5 font-mono text-xs text-[hsl(160_70%_42%)]">
              Complete
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
