/**
 * tryit-attach.ts — adjuntos del «Probar».
 *
 * Quién muestra el picker: la operación lo declara (multipart, binario,
 * `tryitAttachments`, o schema con dataUrl/base64). El input no filtra MIME.
 */
export declare const EXT_TRYIT_ATTACHMENTS = "x-iss-tryit-attachments";
/** Campos JSON donde caen los data URL. Sin partir por tipo de archivo. */
export declare function attachmentFieldNames(op: SwOp | undefined, spec: SwSpec | null | undefined): string[];
export declare function opPrefersMultipart(op: SwOp | undefined): boolean;
export declare function opAllowsAttachments(op: SwOp | undefined, spec?: SwSpec | null | undefined): boolean;
export declare function packTryItBody(op: SwOp | undefined, spec: SwSpec | null | undefined, jsonText: string, files: File[]): Promise<{
    body: string | FormData;
    multipart: boolean;
}>;
