// A file in a folder under glossary-groups/ is not a group: glossary.ts must never load this one (glossary-groups/loading.test.ts).
throw new Error('glossary-groups/old/decoy.ts was loaded; a file in a folder under glossary-groups/ is not a group.');
