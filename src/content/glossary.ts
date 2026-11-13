import { definedGroupWith, namesOf, nameKey, type GlossaryEntry, type GlossaryGroup } from './glossary-group';
import { SOURCES, type SourceRegistry } from './sources';

/**
 * The glossary: every group file in `src/content/glossary-groups/`, with the rules that span groups checked at load
 * (docs/glossary-path-spec.md §2, 11 and 12). The rules inside one group are `defineGlossaryGroup`'s (`glossary-group.ts`).
 */

/**
 * The rules that span groups (spec §2, 11 and 12): group ids and entry ids are unique across groups, and every name (each
 * entry's term and every spelling) is unique across the glossary, ignoring case and outer spaces. Empty when it keeps them.
 */
export function checkGlossaryGroups(groups: readonly GlossaryGroup[]): string[] {
  const issues: string[] = [];
  const groupIds = new Map<string, number>();
  for (const g of groups) groupIds.set(g.id, (groupIds.get(g.id) ?? 0) + 1);
  for (const [id, n] of groupIds) if (n > 1) issues.push(`Duplicate glossary group id "${id}" (${n} groups); give each group its own id.`);
  const entries = new Map<string, string>();
  const names = new Map<string, { entry: string; group: string; name: string }>();
  for (const g of groups) {
    for (const e of g.entries) {
      const first = entries.get(e.id);
      if (first !== undefined && first !== g.id) issues.push(`Entry id "${e.id}" is in group "${first}" and in group "${g.id}"; entry ids are unique across the glossary.`);
      else if (first === undefined) entries.set(e.id, g.id);
      for (const name of namesOf(e)) {
        const same = names.get(nameKey(name));
        if (same === undefined) names.set(nameKey(name), { entry: e.id, group: g.id, name });
        else if (same.entry !== e.id || same.group !== g.id) {
          issues.push(
            `The name "${name}" (entry "${e.id}" of group "${g.id}") is already the name "${same.name}" of entry "${same.entry}" of group "${same.group}"; names are unique across the glossary, ignoring case, so keep one entry for it.`,
          );
        }
      }
    }
  }
  return issues;
}

const GROUP_PATH = /^\.\/glossary-groups\/([^/]+)\.ts$/;

/**
 * Keys the glob result by group id. A group is a file directly in `glossary-groups/`, and the file name must equal the
 * group's id. Each group must be the one `defineGlossaryGroup` returned against `sources`, the real `SOURCES` outside
 * tests, as `lessonsFromModules` asks of a lesson.
 */
export function groupsFromModules(modules: Record<string, GlossaryGroup>, sources: SourceRegistry = SOURCES): GlossaryGroup[] {
  const groups: GlossaryGroup[] = [];
  for (const [path, group] of Object.entries(modules)) {
    const match = GROUP_PATH.exec(path);
    if (match === null) throw new Error(`Unexpected glossary group file path "${path}".`);
    const fileName = match[1]!;
    if (typeof group !== 'object' || group === null || typeof group.id !== 'string') {
      throw new Error(`${path} must default-export defineGlossaryGroup({ ... }).`);
    }
    const checkedAgainst = definedGroupWith(group);
    if (checkedAgainst === undefined) throw new Error(`${path}: the group was not made with defineGlossaryGroup; wrap it so every rule runs.`);
    if (checkedAgainst !== sources) {
      throw new Error(`${path}: the group was checked against a different source list; use defineGlossaryGroup, which checks against SOURCES in src/content/sources.ts.`);
    }
    if (group.id !== fileName) throw new Error(`${path}: the file name "${fileName}" must equal the group id "${group.id}".`);
    groups.push(group);
  }
  const issues = checkGlossaryGroups(groups);
  if (issues.length > 0) throw new Error(`Invalid glossary:\n- ${issues.join('\n- ')}`);
  return groups;
}

// Only files directly in `glossary-groups/` are groups: a test file, or a file in a folder, is not.
const modules = import.meta.glob<GlossaryGroup>(['./glossary-groups/*.ts', '!./glossary-groups/*.test.ts'], { eager: true, import: 'default' });

/** Every group, in file order. Empty until a group file exists. */
export const GLOSSARY_GROUPS: GlossaryGroup[] = groupsFromModules(modules);
/** Every entry of every group, in group then file order. */
export const GLOSSARY: GlossaryEntry[] = GLOSSARY_GROUPS.flatMap((g) => g.entries);
