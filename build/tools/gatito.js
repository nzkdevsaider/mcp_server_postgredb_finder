import { z } from "zod";
export default {
    name: "gatito",
    description: "Devuelve un gatito en ASCII.",
    params: {
        param1: z.string().optional(),
    },
    execute: async ({ param1 }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `:3 miau`,
                },
            ],
        };
    },
};
