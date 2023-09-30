import { world, system, ItemStack, EntityInventoryComponent } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe(
  (arg) => {
    const inventory = arg.initiator?.getComponent("inventory") as EntityInventoryComponent;

    if (!inventory) {
      world.sendMessage("정상적인 식별자가 존재하지 않습니다.");
      return;
    }

    const fromItemId = arg.message.replace(/(.*?):.*?\-.*/, "$1");
    const fromItemCount = arg.message.replace(/.*?:(.*?)\-.*/, "$1");

    const toItemId = arg.message.replace(/.*?\-(\w+):\d+/, "$1");
    const toItemCount = arg.message.replace(/.*?\-\w+:(\d+)/, "$1");

    const fromItem = new ItemStack(`minecraft:${fromItemId}`, +fromItemCount);
    const toItem = new ItemStack(`minecraft:${toItemId}`, +toItemCount);

    for (let i = 0; i <= 35; i = i + 1) {
      const itemStack = inventory.container.getItem(i);
      if (!itemStack) {
        continue;
      } else {
        if ((itemStack as any).amount === (fromItem as any).amount && itemStack.typeId === fromItem.typeId) {
          inventory.container.setItem(i, toItem);
        }
      }
    }
  },
  {
    namespaces: ["npc-trade"],
  }
);
