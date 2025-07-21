export interface ModuleUpdate {
    update: () => void;
}

export abstract class Module {
    public abstract readonly name: string;
    public abstract toggle(): void;

    public active = false;

    public update(): void {}
}
