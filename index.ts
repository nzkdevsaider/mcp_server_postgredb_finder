import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

const server = new McpServer({
  name: "mcp_db_table_analyzer",
  version: "1.0.0",
});

const loadConfig = async () => {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    const configData = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    console.error("Error loading config:", error);
    return { client_db_table_name: "clients" };
  }
};

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
});

server.tool(
  "get-table-info",
  "Obtiene la información de una tabla en específico desde la base de datos PostgreSQL",
  {
    clientId: z.string().nonempty(),
  },
  async ({ clientId }) => {
    try {
      const config = await loadConfig();
      const tableName = config.client_db_table_name || "clients";

      const result = await pool.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [clientId]
      );

      if (result.rows.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No se encontró información con el ID proporcionado",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Información del item con ID ${clientId}:`,
          },
          {
            type: "text",
            text: JSON.stringify(result.rows[0], null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error al obtener información del cliente: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  try {
    await fs.access(".env");
  } catch (error) {
    console.error("No se encontró el archivo .env");
    process.exit(1);
  }

  console.error("Servidor MCP conectado.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
