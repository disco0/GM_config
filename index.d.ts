// Type definitions for GM_config Userscript Library 
// Project: https://github.com/sizzlemctwizzle/GM_config
// Definitions by: disk0 <https://github.com/disco0>
// This definition is based GM_config implementation and wiki
// https://github.com/sizzlemctwizzle/GM_config/wiki

declare namespace GMConfig
{
    export type LabelPosition = 
        | 'above'
        | 'below'
        | 'right'
        | 'left';

    export type LabelSection = 
        | string
        | Element
        | [ 
            Heading:    string | Element, 
            SubHeading: string | Element | undefined 
          ];

    export type Type = keyof TypeMap;

    /**
     * This was originally added for typing default property before realizing its not at
     * least optional on all field types—kept it for future subfield specific mapping,
     * and the ability to define custom types via extension
     */
    export interface TypeMap
    {
        text:           string;
        textarea:       string;
        'unsigned int': number;
        int:            number;
        float:          number;
        checkbox:       boolean;
        radio:          string;
        select:         undefined;
        button:         undefined;
        hidden:         unknown;
    };

    type Handle = () => void;

    type FieldPropertyValue =
        | string
        | ReadonlyArray<string>
        | number
        | Handle;

    /**
     * ### About Fields
     * 
     *   Each type of field that `GM_config` supports allows a different type of value to 
     * be saved using the GUI.
     * 
     * #### Common field properties:
     * 
     *   1) All fields have default values that will be used if you don't include a 
     *      `default` property with your field definition.
     * 
     *   2) All fields can optionally have a label element that can be set using a `label` 
     *      property that can be either a string or a DOM element. If the `label` property 
     *      is listed first in the field definition, it will appear to the left of the 
     *      field, otherwise it will appear to the right. Sometimes this can get annoying 
     *      so you can use a "labelPos" property with a value of either `left`, `right`, 
     *      `above`, or `below` to control the position of the label in relation to the 
     *      field.
     * 
     *   3) All fields can have a `title` property that will show the text as a tooltip 
     *      when hovering over the field.
     */
    export interface Field
    {
        type:      Type;   
        label:     string;
        labelPos?: string;
        section?:  LabelSection;
    };

    export namespace fields
    {
        /**
         * #### text, int, float
         *
         * ----
         *
         *   Each of these field types (text, int, float) use an input element with a type
         * of "text". The difference is that GM_config enforces that "int" and "float"
         * fields actually conform to those datatypes, and prevents the user from entering
         * invalid data. Both "int" and "float" types can be prefixed with "unsigned" to
         * ensure the value entered is non-negative.
         */
        export interface TextField extends Field
        { 
            type: 'text';
            default: string;
            size?: number;
        };
            
        export interface TextAreaField extends Field
        {
            type: 'textarea';
            default: string 
            size?: number
        };

        export interface UIntField extends Field
        {
            type: 'unsigned int';
            default: number;
            min?: number;
            max?: number;
        };

        export interface IntField extends Field
        {
            type: 'int';
            min?: number;
            max?: number;
            default: number;
        };

        export interface FloatField extends Field
        {
            type: 'float';
            default: number;
        };

        export interface CheckboxField extends Field
        {
            type: 'checkbox';
            default: boolean;
        };

        export interface SelectField extends Field
        {
            type: 'checkbox';
            options: readonly [string, ...string[]];
            default?: string;
        };

        export interface RadioField extends Field
        {
            type: 'radio';
            options: readonly [string, ...string[]];
            default?: string;
        };

        export interface HiddenField extends Field
        {
            type: 'hidden';
            value: string
        };

        export interface ButtonField extends Field
        {
            type: 'button';
            size?: number;
            click: () => void;
        };
    };

    export namespace events
    {
        export type OnInit = () => void;
        export type OnOpen = (document: Document, window: Window, frame: HTMLElement) => void;
        export type OnSave<F extends InitOptions['fields']> = (fields: F) => void;
        export type OnClose = () => void;
        export type OnReset = () => void;
    };

    interface Events<F extends InitOptions['fields'] = InitOptions['fields']>
    {
        /**
         * This function will be called once GM_config has been completely initialized.
         * Although, the configuration panel is not open yet, all values have been set. If
         * you want to do some kind of serious modification of `GM_config` internals, this
         * is probably the best time to do it.
         */
        onInit?: events.OnInit;

        /**
         * This function will be called once the configuration panel is open and
         * completely loaded. All the fields have been created and added to the frame.
         * This function is passed three helpful arguments: document (the document object
         * the frame is in), window (the window of the frame), frame (the actual object
         * containing the panel). There are endless possible ways you can modify the
         * configuration panel with the callback. 
         *
         * Somewhat related, there is an `isOpen` property of GM_config that can be used to
         * tell if the configuration panel is currently open. 
         * {@see GM_config#isOpen}
         * 
         */
        onOpen?: events.OnOpen;
        
        /**
         * This function will be called once all the fields have been read and saved. This
         * callback might be useful if you want use the altered values to change the page
         * immediately in some way.
         */
        onSave?: events.OnSave<F>;

        /**
         * This function will be called once the configuration panel has been destroyed.
         * If you want to use the new values to potentially alter the page once the panel
         * is closed, this callback is probably a better choice than onSave.
         */
        onClose?: events.OnClose;

        /**
         * This function will be called when values in the configuration panel are set to
         * stored values. If you have some type of custom fields (like maybe a slider)
         * that relies on a hidden field for data storage, you'll you need to plug into
         * this callback to reset your custom field.
         */
        onReset?: events.OnReset;
    };

    export type ConfigFields = Record<string, Field>;
    
    export interface InitOptions
    {
        id:     string;
        title:  string;

        /**
         *  Collection of JSON objects that you pass to GM_config to represent values, and
         *  the information about these values, that you want GM_config to store and allow
         *  the users of your script to edit through the graphical interface.
         */
        fields: ConfigFields

        css: string
        events?: Events<InitOptions['fields']>
        frame?: HTMLElement
    };

    export interface Instance<F extends ConfigFields = ConfigFields>
    {
        init(options: InitOptions): void;

        /**
         * Does all the DOM building and paints the GUI to the frame.
         */
        open(): void;

        set<FK extends keyof F, FKT extends F[FK]>(key: FK, value: FKT): void;

        /**
         * Allow support for old api usage. It just calls GM_configInit now.
         */
        init(): void;

        open(): void;

        /**
         * Reads in all the values from the GUI and saves them to persistent storage.
         */
        save(): void;

        /**
         * Removes the GUI from the page.
         */
        close(): void;

        /**
         * API method for directly setting one of the values stored internally.
         */
        set<T>(key: string, value: T): void;

        /**
         * API method for directly accessing one of the values stored internally.
         */
        get<T>(key: string): T | undefined;

        /**
         * Writes all field values to persistent storage.
         */
        write(): void;

        /**
         * Reads all field values from persistent storage.
         */
        read(): void;

        /**
         * Makes all fields in the GUI return to their previously saved values.
         */
        reset(): void;

        /**
         * A helper function that allows for easy creation of DOM Elements.
         * 
         * @TODO Quick attempt at typing, probably wrong
         */
        create<T extends keyof ElementTagNameMap>(...args: [T, string] ): ElementTagNameMap[T];
        create<T extends keyof ElementTagNameMap, P extends Partial<{[Key in keyof ElementTagNameMap[T]]: ElementTagNameMap[T][Key]}>>(...args: [T, P] ): ElementTagNameMap[T] & P;
        create(...args: [string]): Text;

        /**
         * Keeps the GUI centered in the window when the window is re-sized.
         */
        center(): void;

        /**
         * A helper function to remove an element from the DOM.
         */
        remove(el: Element): void

        /**
         * A callback method that is called on the GUI has been painted to the frame.
         */
        onOpen: events.OnOpen;

        /**
         * A callback method that is called once field values have been written to persistent storage.
         */
        onSave: events.OnSave<F>;

        /**
         * A callback method that is called once the GUI has been removed from the page.
         */
        onClose: events.OnClose;

        /**
         * A callback method that is called once the fields in the GUI have been restored to their previously saved values.
         */
        onReset: events.OnReset;
        
        /**
         * A unique id for this instance of GM_configStruct.
         */
        id: string;

        /**
         * Where we store the collection of GM_configField objects.
         */
        fields: F;

        /**
         * The title text used for the GUI.
         */
        title: string;

        /**
         * The object we use to store both the basic and custom css for the GUI.
         */
        css: string;
    };

    export interface Constructor
    {
        new <C extends InitOptions>(config: C): Instance<C['fields']>;
    };
}

declare var GM_config: GMConfig.Instance;

declare var GM_configInit: GMConfig.Constructor;