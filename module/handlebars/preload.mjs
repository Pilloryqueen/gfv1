export const preloadedTemplates = {};

export default async function preloadTemplates() {
  const templates = {};
  const filenames = ["item-list-entry", "item-list", "playbook"];

  const keys = filenames.map((filename) => {
    let key = filename
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
    key = key.charAt(0).toLowerCase() + key.slice(1);
    const templateName = `gfv1.${key}`;
    const path = `systems/gfv1/templates/partials/${filename}.hbs`;
    templates[templateName] = path;
    return { key, templateName };
  });

  await loadTemplates(templates);

  return Promise.all(
    keys.map(async ({ key, templateName }) => {
      preloadedTemplates[key] = await getTemplate(templateName);
    })
  );
}
