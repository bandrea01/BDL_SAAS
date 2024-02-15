import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
interface ToastConfig {
    message: string;
    materialIconName?: string;
}
export declare class ToastNotification extends SimpleUIComponent<HTMLDivElement> {
    name: string;
    duration: number;
    innerElements: {
        icon: HTMLSpanElement;
        message: HTMLParagraphElement;
    };
    set materialIcon(name: string | null);
    constructor(components: Components, config: ToastConfig);
    get message(): string | null;
    set message(value: string | null);
    set visible(active: boolean);
    private hideAutomatically;
}
export {};
