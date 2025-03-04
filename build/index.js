import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ToolHandler } from "./handlers/toolsHandler";
import fs from "fs";
import path from "path";
export const NWS_API_BASE = "https://api.weather.gov";
export const USER_AGENT = "weather-app/1.0";
const server = new McpServer({
    name: "weather",
    version: "1.0.0",
});
async function main() {
    const transport = new StdioServerTransport();
    // Load tools
    const tools = new ToolHandler();
    const toolsDir = path.join(__dirname, "tools");
    const files = fs.readdirSync(toolsDir);
    await Promise.all(files.map(async (file) => {
        const tool = (await import(path.join(toolsDir, file)))
            .default;
        tools.registerTool(tool);
    }));
    tools.getAllTools().forEach((tool) => {
        server.tool(tool.name, tool.description, tool.params, tool.execute);
    });
    await server.connect(transport);
}
main().catch((error) => {
    process.exit(1);
});
