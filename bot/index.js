const { Client } = require("discord.js");
const { spawn } = require("child_process");
const md = require("markdownify").markdownify;

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async (message) => {
  if (message.author.bot) return;

  if (message.channel.id !== "<channel_id>") return;

  const NOTES_KEYWORD = "NOTES";
  const FOLDER_KEYWORD = "FOLDER";
  const MESSAGE_KEYWORD = "MESSAGE";

  if (message.content.includes(NOTES_KEYWORD)) {
    let folderName = "";
    let fileName = "";
    let content = "";

    if (message.content.includes(FOLDER_KEYWORD)) {
      folderName = message.content.split(FOLDER_KEYWORD)[1].trim();
      fileName = message.content.split(NOTES_KEYWORD)[0].trim() + ".md";
      content = message.content
        .split(FOLDER_KEYWORD)[1]
        .replace(NOTES_KEYWORD, "")
        .trim();
    } else if (message.content.includes(MESSAGE_KEYWORD)) {
      folderName = "";
      fileName = message.content.split(NOTES_KEYWORD)[0].trim() + ".md";
      content = message.content.split(MESSAGE_KEYWORD)[1].trim();
    } else {
      return;
    }

    // Create folder if it doesn't exist
    if (folderName) {
      const mkdir = spawn("mkdir", ["-p", folderName]);
      await new Promise((resolve) => mkdir.on("exit", resolve));
    }

    // Create markdown file
    const filePath = folderName ? `${folderName}/${fileName}` : fileName;
    const fileContent = md(content);
    const writeFile = spawn("sh", [
      "-c",
      `echo '${fileContent}' > ${filePath}`,
    ]);
    await new Promise((resolve) => writeFile.on("exit", resolve));

    // Commit and push to Git repo
    const commit = spawn("git", ["add", filePath]);
    await new Promise((resolve) => commit.on("exit", resolve));

    const commitMsg = `Added "${fileName}"`;
    const commitWithMsg = spawn("git", ["commit", "-m", commitMsg]);
    await new Promise((resolve) => commitWithMsg.on("exit", resolve));

    const push = spawn("git", ["push"]);
    await new Promise((resolve) => push.on("exit", resolve));
  }
});

client.login(process.env.DISCORD_TOKEN);
