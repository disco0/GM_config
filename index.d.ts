// Type definitions for GM_config Userscript Library 
// Project: https://github.com/sizzlemctwizzle/GM_config
// Definitions by: disk0 <https://github.com/disco0>
// This definition is based GM_config implementation and wiki
// https://github.com/sizzlemctwizzle/GM_config/wiki

declare namespace GMConfig
{
    export type LabelPosition = 
        | 'right'
        | 'below'
        | 'above'

    export type Type = keyof TypeMap

    /**
     * This was originally added for typing default property before realizing its not at
     * least optional on all field types—kept it for future subfield specific mapping 
     */
    export type TypeMap =
    {
        text:           string
        textarea:       string
        'unsigned int': number
        'float':        number
        checkbox:       boolean
        radio:          string;
        select:         undefined;
        button:         undefined;
        hidden:         unknown;
    }

    export interface Field<T extends Type = Type>
    {
        label:   string
        labelPos?: string

        type:    T
        section?: string
    }

    export namespace fields
    {
        export type TextField = 
            & Field<'text'> 
            & { default: string }
            
        export type TextAreaField = 
            & Field<'textarea'> 
            & { default: string }

        export type UIntField = 
            & Field<'unsigned int'>
            & { default: number }

        export type RadioField = 
            & Field<'radio'>
            & { default: string
                options: string[] }

        export type FloatField = 
            & Field<'float'>
            & { default: string }

        export type ButtonField =
            & Field<'button'>
            & { click: () => void }
    }
    
    export interface InitOptions
    {
        id:     string;
        title:  string;
        fields: Record<string, Field>
        css:    string
    }
    export interface ConfigConstructorOptions extends InitOptions
    {
        frame: HTMLElement
    }

    export interface Instance
    {
        init(options: InitOptions): void
        open(): void;
        set<T extends TypeMap[Type]>(key: string, value: T): void
    }

    export interface Constructor
    {
        new (config: ConfigConstructorOptions): Instance
    }
}
