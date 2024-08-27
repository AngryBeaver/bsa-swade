
class AbilityTest implements TestClass<"ability"|"dc"> {
    public type= "AbilityTest";
    _choices:{[id:string]:{text:string,img?:string}} = {}

    constructor(){
        this._choices = beaversSystemInterface.configAbilities.reduce((object, ability) => {
            object[ability.id] = { text: ability.label };
            return object;
        }, {})
    }

    create(data:Record<"ability"|"dc",any>){
        const result = new AbilityTestCustomized();
        result.data = data;
        result.parent = this;
        return result;
    }

    public informationField:InfoField = {
        name: "type",
        type: "info",
        label: game['i18n'].localize("beaversSystemInterface.tests.abilityTest.info.label"),
        note: game['i18n'].localize("beaversSystemInterface.tests.abilityTest.info.note")
    }
    public get customizationFields(): Record<"ability"|"dc",InputField>{
        return {
            ability: {
                name: "ability",
                label: "ability",
                note: "Ability",
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
        }
    }

}

class AbilityTestCustomized implements Test<"ability"|"dc"> {

    parent: AbilityTest;

    data={dc:4,ability:""}

    public action = async (initiatorData: InitiatorData):Promise<TestResult> => {
        const actor = beaversSystemInterface.initiator(initiatorData).actor;
        const roll = await beaversSystemInterface.actorRollAbility(actor,this.data.ability);
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
        const ability = this.parent._choices[this.data.ability]?.text||"process";
        return `${ability}:dc ${this.data.dc}`;
    };

}
beaversSystemInterface.registerTestClass(new AbilityTest());