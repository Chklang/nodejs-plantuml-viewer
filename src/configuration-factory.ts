import * as Confene from "confene";
import { staticImplements } from "./static-implements";

@staticImplements<Confene.IConfigurationFactory<IConfiguration>>()
export class ConfigurationFactory {
    public static instance: Promise<IConfiguration>;
    public static description: Confene.IConfigurationParameters<IConfiguration> = {
        confFileName: ".plantuml.conf.json",
        description: {
            port: {
                default: 80,
                description: "Change port used by web server. Default is standard HTTP (80)",
                name: "port",
                type: "number",
            },
            updateTimer: {
                default: 1000,
                description: "Waiting time in ms before refresh schema after a modification into textarea. 1000ms by default",
                name: "updateTimer",
                type: "number",
            },
        },
    };
}

export interface IConfiguration {
    port?: number;
    updateTimer?: number;
}
