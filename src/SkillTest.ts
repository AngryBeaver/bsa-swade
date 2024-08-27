
class SkillTest implements TestClass<"skill"|"dc"> {
    public type:string =  "SkillTest"
    _choices:{[key:string]:{text:string, img?:string}} = {};
    constructor(){
        this._choices = beaversSystemInterface.configSkills.reduce((object, skill) => {
            object[skill.id] = { text: skill.label };
            return object;
        }, {})
    }
    public create(data:Record<"skill"|"dc",any>){
        const result = new SkillTestCustomized();
        result.data = data;
        result.parent = this;
        return result;
    }
    public informationField:InfoField = {
        name: "type",
        type: "info",
        label: game['i18n'].localize("beaversSystemInterface.tests.skillTest.info.label"),
        note: game['i18n'].localize("beaversSystemInterface.tests.skillTest.info.note")
    }

    get customizationFields(): Record<"dc"|"skill",InputField>{
        return {
            skill: {
                name: "skill",
                label: "skill",
                note: "Skill",
                type: "selection",
                choices: this._choices
            },
            dc: {
                name: "dc",
                label: "dc",
                note: "Difficulty Class ",
                defaultValue: 4,
                type: "number",
            }
        };
    }

}

class SkillTestCustomized implements Test<"skill"|"dc"> {

    parent: SkillTest
    data:{dc:number,skill:string}={dc:4,skill:""}

    public action = async (initiatorData: InitiatorData):Promise<TestResult> => {
        const actor = beaversSystemInterface.initiator(initiatorData).actor;
        const roll = await beaversSystemInterface.actorRollSkill(actor,this.data.skill);
        let dc = this.data.dc;
        if(this.data.dc <= 0){
            dc = 1;
        }
        const success = Math.floor(roll.total/dc);
        return {
            success:success,
            fail: success>0?0:1
        }
    }

    public render = (): string => {
        const skill = this.parent._choices[this.data.skill]?.text||"process";
        return `${skill}:dc ${this.data.dc}`;
    };

}

beaversSystemInterface.registerTestClass(new SkillTest());