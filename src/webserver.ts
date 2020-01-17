import * as Confene from "confene";
import * as http from "http";
import * as Plantuml from "node-plantuml-latest";
import * as url from "url";
import { ConfigurationFactory } from "./configuration-factory";

Confene.ConfigurationFactory.get(ConfigurationFactory).then((config) => {
    const formulaire = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div style="display: flex;height: 100%;">
            <form method="POST" action="/generate" target="_blank" enctype="text/plain" style="flex-grow: 1; display: flex; flex-flow: column;">
                schema: <textarea name="source" id="uml" style="flex-grow: 1;" onKeyDown="updateSchame()"></textarea><br />
                <div style="display: flex;">
                    <button type="button" style="flex-grow: 1;" onclick="openPopup()">Ouvrir la popup</button>
                    <button type="submit" style="flex-grow: 1;">Valider</button>
                </div>
            </form>
        </div>
        <script type="text/javascript">
            const textArea = document.getElementById("uml");
            let lastText = null;
            let popupWindow = null;
            let nextUpdate = null;
            function updateSchame() {
                if (!popupWindow) {
                    return;
                }
                if (nextUpdate !== null) {
                    clearTimeout(nextUpdate);
                }
                if (lastText !== null && lastText === textArea.value.trim()) {
                    //Ignore update, no modification
                    return;
                }
                nextUpdate = setTimeout(() => {
                    nextUpdate = null;
                    lastText = textArea.value.trim();
                    fetch("/schema", {
                        method: "POST",
                        body: lastText
                    }).then(response => {
                        return response.text();
                    }).then(content => {
                        popupWindow.document.body.innerHTML = content;
                    }).catch(console.error);
                }, ` + config.updateTimer + `);
            }
            function openPopup() {
                popupWindow = open("", "newWindow", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
                popupWindow.document.head.innerHTML = '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
                lastText = null;
                updateSchame();
            }
        </script>
    </body>
    </html>
    `;
    const server = http.createServer((request, response) => {
        const uri = url.parse(request.url as string);
        if (uri.path === "/" && request.method === "GET") {
            response.writeHead(200);
            response.write(formulaire, "text/html");
            response.end();
        } else if (uri.path === "/schema" && request.method === "POST") {
            let body = "";
            request.on("data", (chunk) => {
                body += chunk.toString(); // convert Buffer to string
            });
            request.on("end", () => {
                const generator = Plantuml.generate(body, { format: "svg", charset: "UTF-8" });
                response.writeHead(200, {
                    "Content-Type": "image/svg+xml;charset=UTF-8",
                });
                generator.out.pipe(response);
                generator.out.on("end", () => {
                    response.end();
                });
            });
        } else if (uri.path === "/generate" && request.method === "POST") {
            let body = "";
            request.on("data", (chunk) => {
                body += chunk.toString(); // convert Buffer to string
            });
            request.on("end", () => {
                body = body.substr(7);
                const generator = Plantuml.generate(body, { format: "png", charset: "UTF-8" });
                response.writeHead(200, {
                    "Content-Type": "image/png",
                });
                generator.out.pipe(response);
                generator.out.on("end", () => {
                    response.end();
                });
            });
        } else {
            response.writeHead(200);
            response.write("Current path: " + uri.path, "text/html");
            response.end();
        }
    }).listen(config.port);
    // tslint:disable-next-line:no-console
    console.log("Welcome on Plantuml-Viewer");
    // tslint:disable-next-line:no-console
    console.log("Server started on port", config.port);
});
