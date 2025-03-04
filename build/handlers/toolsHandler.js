class ToolHandler {
    tools;
    constructor() {
        this.tools = new Map();
    }
    registerTool(tool) {
        if (!tool.name) {
            throw new Error("La Tool debe tener un nombre.");
        }
        this.tools.set(tool.name, tool);
    }
    getTool(name) {
        return this.tools.get(name);
    }
    getAllTools() {
        return Array.from(this.tools.values());
    }
    async executeTool(name) {
        const tool = this.getTool(name);
        if (!tool) {
            throw new Error(`Tool ${name} no encontrada.`);
        }
        return tool.execute ? tool.execute(tool.params) : null;
    }
}
export { ToolHandler };
