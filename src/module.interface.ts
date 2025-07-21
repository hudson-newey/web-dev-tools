export interface Module {
    name: string;
    callback: (active: boolean) => void;
    active: boolean;
}
