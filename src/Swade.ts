export class Swade implements SystemApi {

    get version() {
        return 1;
    }

    get id() {
        return "swade";
    }

    async actorRollSkill(actor, skillId){
        const skills = actor.items.filter(i=>i.type === "skill" && i.name.toLowerCase() === skillId.toLowerCase())
        const skill = skills[0].id;
        const result = await actor.rollSkill(skill);
        return result;
    }

    async actorRollAbility(actor, abilityId){
        const result =  await actor.rollAttribute(abilityId);
        return result;
    }

    actorCurrenciesGet(actor):Currencies {
        return {"main":actor["system"].details.currency};
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {details: { currency: currencies["main"]}}});
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string):void {
        const tabs = $(html).find('nav[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '" title="' + tabData.label + '">'+tabData.label+'</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-body");
        const tabContent = $('<section class="tab" data-group="primary" data-tab="' + tabData.id + '"></section>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    itemSheetReplaceContent(app, html, element):void {
        html.find('.main-grid > .sheet-sidebar').remove();
        html.find('.main-grid > nav.tabs').remove();
        const sheetBody = html.find('.main-grid > .sheet-body');
        sheetBody.empty();
        sheetBody.append(element);
        sheetBody.css('grid-column','1/-1');
    }

    get configSkills():SkillConfig[] {
        return game['packs'].get(game['settings'].get('swade', 'coreSkillsCompendium')).index.map(skill=>{
            return {
                id: skill.name,
                label: skill.name
            }
        });
    }

    get configAbilities():AbilityConfig[] {
        return Object.entries(CONFIG["SWADE"].attributes).map(ab => {
            // @ts-ignore
            const long = ab[1].long;
            return {
                id: ab[0],
                label: game["i18n"].localize(long)
            };
        });
    }

    get configCurrencies():CurrencyConfig[] {
        return [
            {
                id: "main",
                factor: 1,
                label: game["i18n"].localize("SWADE.Currency")
            }
        ]
    }

    get configCanRollAbility():boolean {
        return true;
    }
    get configLootItemType(): string {
        return "gear";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity";
    }

}