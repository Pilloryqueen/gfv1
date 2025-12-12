// This would be much nicer if we targeted v13 -.-

export default async function fromUuid(uuid) {
  const resolved = foundry.utils.parseUuid(uuid);
  const doc = resolved.collection.get(resolved.documentId);
  if (!doc) {
    return resolved.collection.getDocument(resolved.documentId); // compendium
  }
  if (!resolved.embedded.length > 0) {
    return doc;
  }
  if (resolved.embedded[0] === "Item") {
    return doc.items.get(resolved.embedded[1]);
  }

  throw new Error(` Could not resolve ${uuid}`);
}
