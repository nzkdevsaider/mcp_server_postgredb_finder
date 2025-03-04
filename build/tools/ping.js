import { z } from "zod";
export default {
    name: "ip-site",
    description: "Obtiene la dirección IP de un sitio web.",
    params: {
        url: z.string(),
    },
    execute: async ({ url }) => {
        const { exec } = require("child_process");
        return new Promise((resolve) => {
            exec(`nslookup ${url}`, (error, stdout, stderr) => {
                if (error) {
                    resolve({
                        content: [
                            {
                                type: "text",
                                text: `Ocurrió un error al hacer ping a este sitio: ${error.message}`,
                            },
                        ],
                    });
                }
                resolve({
                    content: [
                        {
                            type: "text",
                            text: `El ping de ${url} es: ${stdout}`,
                        },
                    ],
                });
            });
        });
    },
};
