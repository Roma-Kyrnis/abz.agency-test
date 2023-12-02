export type ZodFailHandlerRes = { [key: string]: string[] };
/** return property with value. This property will be created or updated */
export type ZodFailPathHandler = (path: string | number) => { [key: string]: string } | undefined;
