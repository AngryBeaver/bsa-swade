export class Settings {

    static NAMESPACE = "bsa-swade";
    public static SKILLS = "skills";

    static init() {
        game["settings"].register(this.NAMESPACE, this.SKILLS, {
            name: "Additional Skills",
            hint: "coma seperated list of skill names.",
            scope: "world",
            config: true,
            default: "",
            requiresReload: true,
            type: String,
        });
    }

    static get(key) {
        return game["settings"].get(this.NAMESPACE, key);
    };

    static set(key, value) {
        game["settings"].set(this.NAMESPACE, key, value);
    }

}