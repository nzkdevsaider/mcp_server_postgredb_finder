import { z } from "zod";
export default {
    name: "prueba1",
    description: "Devuelve el mensaje que introduzcas.",
    params: {
        param1: z.string().optional(),
    },
    execute: async ({ param1 }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `El mensaje introducido es: ${param1}`,
                },
            ],
        };
    },
};
