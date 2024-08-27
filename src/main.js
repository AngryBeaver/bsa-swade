import {Swade} from "./Swade.js";
import { Settings } from "./Settings.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Swade());
    Settings.init();
});

Hooks.on("beavers-system-interface.ready", async function(){
    import("./SkillTest.js")
});