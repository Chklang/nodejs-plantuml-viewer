
declare module "node-plantuml-latest" {
    import { Stream, Writable } from "stream";
    function generate(content: string, params: { format: string; charset: string; }): IGenerator;

    export interface IGenerator {
        in: NodeJS.WritableStream;
        out: NodeJS.ReadableStream;
    }
}
