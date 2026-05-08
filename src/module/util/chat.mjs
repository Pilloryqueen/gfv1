export async function welcomeMessage(version) {
  const chatData = {
    speaker: { alias: "LadyNova" },
    user: game.user.id,
    whisper: [game.user.id],
    flags: { core: { canPopout: true } },
    content: await renderTemplate("systems/gfv1/templates/chat/welcome.hbs", {
      version,
    }),
  };

  return ChatMessage.create(chatData);
}
