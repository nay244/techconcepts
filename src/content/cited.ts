import type { Backing, Lesson, Unit } from './schema';
import { checkCitation, type Citation, type SourceRegistry } from './sources';
import { textsAt } from './texts';

/**
 * The rules only a lesson in the cited shape keeps (direction doc §3.1, §6.4; the owner's ruling 4), as readable
 * issues. Each names its place by path, such as `units[0].learn.lead[1] ("lead-2")`, and says what to do.
 * `validateLesson` (`define.ts`) runs them before the structural rules every lesson keeps; the legacy path does not.
 *
 * What cites: Learn's statements, terms, pattern, Go deeper and facts; every Watch step's Go deeper; every Practice
 * option (its feedback explains the answer); and the OSI layers, unless the unit spans layers. A Learn lead or why
 * statement, or a term, may instead be an analogy, which cites nothing. What does not cite carries a backing: the
 * cited Learn ids it traces to, or a flag saying it is an analogy or example data.
 */

/** A part that must cite: where it sits, its citations, and whether it may be flagged as an analogy instead. */
export interface CitedPart {
  at: string;
  cite: Citation[];
  /** A Learn lead or why statement, or a term: cited, or an analogy. Every other part must cite. */
  statement: boolean;
  analogy?: true;
  /** The part itself. A Practice option also says whether it is the answer (`right`), which the option alone does not. */
  value: unknown;
}

/** A part of Watch or the scene, which cites nothing itself: where it sits, its backing, and the part itself. */
export interface BackedPart {
  at: string;
  backing: Backing | undefined;
  value: unknown;
}

/** A Learn part a trace may name. */
interface Target {
  cited: boolean;
  analogy: boolean;
}

const MUST_CITE = 'no citation; cite a source at the section it comes from.';
const NO_BACKING = 'no backing; trace it to a cited Learn statement, or flag it as an analogy or as example data.';
const LESSON_NUMBER = /\blessons? \d+/gi;

/**
 * What is wrong with a statement that must be cited or flagged as an analogy, never both; undefined when it is one or
 * the other. Learn's lead and why statements, its terms, and glossary definitions keep this rule.
 */
export function statementIssue(s: { cite: Citation[]; analogy?: true }): string | undefined {
  if (s.analogy === true && s.cite.length > 0) {
    return 'both cited and flagged as an analogy; an analogy carries no citation, so remove the flag or the citations.';
  }
  if (s.analogy !== true && s.cite.length === 0) return 'no citation; cite a source or flag it as an analogy.';
  return undefined;
}

const osiCitations = (u: Unit): Citation[] => (u.osi === 'spans' ? [] : u.osi.cite);

/**
 * A unit's parts that cite, in reading order: the Watch steps' Go deeper; Learn's lead, terms, pattern, why, Go deeper
 * and facts; Practice. The OSI badge, which reads first, has its own rule.
 */
function citedParts(u: Unit, at: string): CitedPart[] {
  const { learn } = u;
  const part = (where: string, value: { cite: Citation[]; analogy?: true }, statement = false): CitedPart => ({
    at: where,
    cite: value.cite,
    statement,
    analogy: value.analogy,
    value,
  });
  return [
    ...u.steps.flatMap((step, i) => step.deep.map((p, j) => part(`${at}.steps[${i}].deep[${j}] (step "${step.id}", Go deeper)`, p))),
    ...learn.lead.map((s, i) => part(`${at}.learn.lead[${i}] ("${s.id}")`, s, true)),
    ...learn.terms.map((t, i) => part(`${at}.learn.terms[${i}] ("${t.id}")`, t, true)),
    part(`${at}.learn.pattern ("${learn.pattern.id}")`, learn.pattern),
    ...learn.why.map((s, i) => part(`${at}.learn.why[${i}] ("${s.id}")`, s, true)),
    ...learn.deep.map((p, i) => part(`${at}.learn.deep[${i}] ("${p.id}", Learn's Go deeper)`, p)),
    ...learn.facts.map((f, i) => part(`${at}.learn.facts[${i}] ("${f.id}")`, f)),
    ...u.practice.flatMap((q, i) =>
      q.options.map((o, j) => part(`${at}.practice[${i}].options[${j}] (question "${q.id}")`, { ...o, right: j === q.answer })),
    ),
  ];
}

/**
 * Every citation of a unit, in reading order: the OSI badge, the Watch steps' Go deeper, Learn (lead, terms, pattern,
 * why, Go deeper, facts), Practice. The unit's sources are listed in the order these first cite them.
 */
export function citationsOf(u: Unit): Citation[] {
  return [...osiCitations(u), ...citedParts(u, '').flatMap((p) => p.cite)];
}

/** Every part of a lesson that must cite, unit by unit, in reading order (see `citedParts`). */
export function citedPartsOf(lesson: Lesson): CitedPart[] {
  return lesson.units.flatMap((u, i) => citedParts(u, `units[${i}]`));
}

/**
 * How many independent sources these citations rest on. Two sections of one document are one source, and so are two
 * pages of one vendor: a `vendor` source speaks as its publisher, any other source as itself.
 */
export function independentSources(cites: Citation[], sources: SourceRegistry): number {
  const voices = new Set(
    cites.map((c) => {
      const entry = Object.hasOwn(sources, c.source) ? sources[c.source] : undefined;
      return entry?.kind === 'vendor' ? `vendor:${entry.publisher}` : c.source;
    }),
  );
  return voices.size;
}

/**
 * What is wrong with a cited claim's sources under the two-source rule (owner, 2026-11-08), or undefined: every claim
 * rests on two independent sources, unless a citation is marked as the defining standard. No citation at all is the
 * citation rule's to report.
 */
export function twoSourceIssue(cites: Citation[], sources: SourceRegistry): string | undefined {
  if (cites.length === 0 || cites.some((c) => c.defining === true) || independentSources(cites, sources) >= 2) return undefined;
  return 'rests on one source; cite a second, independent source that states the same thing (another document, not another page of the same vendor), or mark the citation as the defining standard with cite(..., { defining: true }).';
}

/** The parts of a unit's Learn that a trace may name, by id, in reading order, with where each sits (`lead[0]`, `pattern`). */
function learnParts(u: Unit): { id: string; place: string; cite: Citation[]; analogy: boolean }[] {
  const { learn } = u;
  const statement = (place: string, s: { id: string; cite: Citation[]; analogy?: true }) => ({ id: s.id, place, cite: s.cite, analogy: s.analogy === true });
  return [
    ...learn.lead.map((s, i) => statement(`lead[${i}]`, s)),
    ...learn.terms.map((t, i) => statement(`terms[${i}]`, t)),
    statement('pattern', learn.pattern),
    ...learn.why.map((s, i) => statement(`why[${i}]`, s)),
    ...learn.deep.map((p, i) => statement(`deep[${i}]`, p)),
    ...learn.facts.map((f, i) => statement(`facts[${i}]`, f)),
  ];
}

/**
 * Every part of a lesson that needs a backing: the lesson (its subtitle and summary), each unit (its full name and
 * purpose), the scene, each packet, the Overview's hook and description, each Overview fact, and each step, step fact
 * and event.
 */
export function backedPartsOf(lesson: Lesson): BackedPart[] {
  return [
    { at: "backing (the lesson's subtitle and summary)", backing: lesson.backing, value: { subtitle: lesson.subtitle, summary: lesson.summary } },
    ...lesson.units.flatMap((u, i) => {
      const at = `units[${i}]`;
      const { scene, overview } = u;
      return [
        { at: `${at}.backing (the unit's full name and purpose)`, backing: u.backing, value: { fullName: u.fullName, purpose: u.purpose } },
        { at: `${at}.scene.backing (the scene)`, backing: scene.backing, value: scene },
        ...Object.entries(scene.packets ?? {}).map(([id, p]) => ({ at: `${at}.scene.packets.${id} (packet "${id}")`, backing: p.backing, value: p })),
        { at: `${at}.overview.hookBacking (the Overview hook)`, backing: overview.hookBacking, value: { hook: overview.hook } },
        { at: `${at}.overview.backing (the Overview description)`, backing: overview.backing, value: { description: overview.description } },
        ...overview.facts.map((f, j) => ({ at: `${at}.overview.facts[${j}] (Overview fact "${f.label}")`, backing: f.backing, value: f })),
        ...u.steps.flatMap((step, j) => {
          const here = `${at}.steps[${j}]`;
          return [
            { at: `${here} (step "${step.id}")`, backing: step.backing, value: step },
            ...step.facts.map((f, k) => ({ at: `${here}.facts[${k}] (step "${step.id}", fact "${f.label}")`, backing: f.backing, value: f })),
            ...step.events.map((e, k) => ({ at: `${here}.events[${k}] (event "${e.id}")`, backing: e.backing, value: e })),
          ];
        }),
      ];
    }),
  ];
}

// ---------------------------------------------------------------- the rules, in the order they are reported

/** Rule 1: one unit. Lessons of several units exist only on the legacy path. */
function oneUnit(lesson: Lesson): string[] {
  const n = lesson.units.length;
  return n === 1 ? [] : [`A cited lesson has exactly one unit; this one has ${n}. Make each unit a lesson of its own.`];
}

/** Rule 2: a unit's sources come from its citations, so none are written. */
function writtenReferences(u: Unit, at: string): string[] {
  if (u.references.length === 0) return [];
  return [`${at}.references: references come from citations; leave the list out, and the unit's sources are listed from what it cites.`];
}

/** Rule 3: every part that cites has a citation; a statement or term may be an analogy instead, never both. */
function uncited(u: Unit, at: string): string[] {
  return citedParts(u, at).flatMap((p) => {
    const problem = p.statement ? statementIssue(p) : p.cite.length === 0 ? MUST_CITE : undefined;
    return problem === undefined ? [] : [`${p.at}: ${problem}`];
  });
}

/**
 * Rule 4: every cited claim rests on two independent sources, or on a citation marked as the defining standard
 * (owner, 2026-11-08). An analogy cites nothing, so the rule passes it by. The OSI badge keeps it too.
 */
function oneSource(u: Unit, at: string, sources: SourceRegistry): string[] {
  const parts = [...(u.osi === 'spans' ? [] : [{ at: `${at}.osi`, cite: u.osi.cite }]), ...citedParts(u, at).filter((p) => p.analogy !== true)];
  return parts.flatMap((p) => {
    const problem = twoSourceIssue(p.cite, sources);
    return problem === undefined ? [] : [`${p.at}: ${problem}`];
  });
}

/** Rule 5: an OSI badge names layers only when a source puts the unit there; otherwise it spans layers. */
function uncitedOsi(u: Unit, at: string): string[] {
  if (u.osi === 'spans' || u.osi.cite.length > 0) return [];
  return [`${at}.osi: the OSI layers (${u.osi.layers.join(', ')}) have no citation; cite a source that puts the unit at these layers, or make it 'spans'.`];
}

/** Rule 6: every part of Watch and the scene has a backing. */
function missingBacking(parts: BackedPart[]): string[] {
  return parts.filter((p) => p.backing === undefined).map((p) => `${p.at}: ${NO_BACKING}`);
}

/** Rule 7, first half: Learn ids are unique within the unit, since traces name them. */
function duplicateLearnIds(u: Unit, at: string): string[] {
  const first = new Map<string, string>();
  const issues: string[] = [];
  for (const { id, place } of learnParts(u)) {
    const seen = first.get(id);
    if (seen === undefined) first.set(id, place);
    else issues.push(`${at}.learn: Duplicate Learn id "${id}" (${seen} and ${place}); give each its own id.`);
  }
  return issues;
}

/**
 * Rule 7, second half: every trace names a cited Learn part of this lesson: a lead or why statement, a term, the
 * pattern, a fact, or a paragraph of Learn's Go deeper. An analogy, a step's Go deeper (which has no id) and an id of
 * another lesson are not targets.
 */
function badTraces(parts: BackedPart[], lesson: Lesson): string[] {
  const targets = new Map<string, Target>();
  for (const u of lesson.units) {
    for (const p of learnParts(u)) if (!targets.has(p.id)) targets.set(p.id, { cited: p.cite.length > 0, analogy: p.analogy });
  }
  const issues: string[] = [];
  for (const { at, backing } of parts) {
    if (backing === undefined || !('traces' in backing)) continue;
    for (const id of backing.traces) {
      const target = targets.get(id);
      if (target === undefined) {
        issues.push(
          `${at}: traces "${id}", which is not a Learn lead or why statement, term, pattern, fact or Go-deeper paragraph of this lesson; trace one of those by its id.`,
        );
      } else if (target.analogy) {
        issues.push(`${at}: traces "${id}", which is an analogy; trace a cited Learn statement instead, or flag this as an analogy too.`);
      } else if (!target.cited) {
        issues.push(`${at}: traces "${id}", which has no citation; cite it, or trace a cited Learn statement instead.`);
      }
    }
  }
  return issues;
}

/** Rule 8: every citation is one the registry builds, of a source that may back content. */
function unsoundCitations(u: Unit, at: string, sources: SourceRegistry): string[] {
  const parts = [{ at: `${at}.osi`, cite: osiCitations(u) }, ...citedParts(u, at)];
  return parts.flatMap((p) =>
    p.cite.flatMap((c, n) => checkCitation(c, sources, 'content').map((problem) => `${p.at}, citation ${n + 1}: ${problem}`)),
  );
}

/** Rule 9: no "lesson N", since a shared lesson's number differs from track to track. */
function lessonNumbers(lesson: Lesson): string[] {
  return textsAt(lesson).flatMap(({ path, text }) =>
    [...text.matchAll(LESSON_NUMBER)].map(
      (m) => `${path}: says "${m[0]}"; a lesson's number differs from track to track, so name the lesson instead.`,
    ),
  );
}

/** Every cited-only rule's issues, rule by rule (1–9); empty when the lesson keeps them all. */
export function checkCitedRules(lesson: Lesson, sources: SourceRegistry): string[] {
  const units = lesson.units.map((u, i) => ({ u, at: `units[${i}]` }));
  const backed = backedPartsOf(lesson);
  return [
    ...oneUnit(lesson),
    ...units.flatMap(({ u, at }) => writtenReferences(u, at)),
    ...units.flatMap(({ u, at }) => uncited(u, at)),
    ...units.flatMap(({ u, at }) => oneSource(u, at, sources)),
    ...units.flatMap(({ u, at }) => uncitedOsi(u, at)),
    ...missingBacking(backed),
    ...units.flatMap(({ u, at }) => duplicateLearnIds(u, at)),
    ...badTraces(backed, lesson),
    ...units.flatMap(({ u, at }) => unsoundCitations(u, at, sources)),
    ...lessonNumbers(lesson),
  ];
}
