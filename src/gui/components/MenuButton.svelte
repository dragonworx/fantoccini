<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import {
  MenuItem,
  MenuPosition,
  MenuTrigger,
  MenuStackItem,
  onSelectHandler,
  Action,
  nextId,
} from "../";
import Button from "./Button.svelte";
import Menu from "./Menu.svelte";
import { isAcceptKey, isModifier } from "../filters";

export let isEnabled: boolean = true;
export let items: MenuItem[];
export let selectedIndex: number = -1;
export let hoverIndex: number = selectedIndex;
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;
export let noStyle: boolean = false;
export let retainSelection: boolean = false;
export let customClasses: { down?: string } = {};

let id = nextId();

const stack: MenuStackItem[] = [];
const dispatch = createEventDispatcher();
let button: Button;
let menu: Menu;
let onMouseDown: (e: MouseEvent) => void;
let onInternalKeyDown: (e: KeyboardEvent) => void;

Action.notifications.on("execute", (action) => {
  if (isOpen) {
    close();
  }
});

export function getIsOpen() {
  return isOpen;
}

export function open() {
  isOpen = true;
  hoverIndex = selectedIndex;
  stack.length && stack[0].setHoverIndex(selectedIndex);
  button.setIsDown(true);
  dispatch("open");

  setTimeout(() => {
    onMouseDown = (e: MouseEvent) => {
      if (button && !button.containsEvent(e.target as Node)) {
        const contains = stack.some((item) => item.containsEvent(e));
        if (!contains) {
          close();
        }
      }
      clearBlurHandlers();
    };
    window.addEventListener("mousedown", onMouseDown);
    onInternalKeyDown = (e: KeyboardEvent) => {
      if (isModifier(e.key)) {
        return;
      }
      // console.log("onInternalKeyDown", id);
      if (button && !button.containsEvent(e.target as Node)) {
        close();
      }
    };
    window.addEventListener("keydown", onInternalKeyDown);
  }, 0);
}

export function close(shouldDispatch: boolean = true) {
  isOpen = false;
  button.setIsDown(false);
  if (!retainSelection) {
    selectedIndex = hoverIndex = -1;
    menu.clear(true);
  } else {
    menu.clear();
  }
  shouldDispatch && dispatch("close");
  stack.length = 0;
  clearBlurHandlers();
}

function clearBlurHandlers() {
  if (onMouseDown) {
    window.removeEventListener("mousedown", onMouseDown);
    onMouseDown = undefined;
  }
  if (onInternalKeyDown) {
    window.removeEventListener("keydown", onInternalKeyDown);
    onInternalKeyDown = undefined;
  }
}

export function getButton() {
  return button;
}

export function getHoverIndex() {
  return hoverIndex;
}

export function hasCurrentSubMenu() {
  if (stack.length) {
    return getActiveStack().hasCurrentSubMenu();
  } else {
    return false;
  }
}

export function hasPreviousSubMenu() {
  const index = getActiveStackIndex();
  return index > 0 && stack[index - 1].hasCurrentSubMenu();
}

export function getStack() {
  return stack;
}

export function getActiveStack() {
  const index = getActiveStackIndex();
  return stack[index];
}

export function getActiveStackIndex() {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].isActive) {
      return i;
    }
  }
}

export function getStackTop() {
  return stack[stack.length - 1];
}

export function increment(startFrom: number = -1) {
  const listener = getActiveStack();
  const currentItems = listener.getItems();
  const nextIndex = Math.min(
    currentItems.length - 1,
    (startFrom > -1 ? startFrom : listener.getHoverIndex()) + 1
  );
  if (
    currentItems[nextIndex].isEnabled === false ||
    currentItems[nextIndex].label === "-"
  ) {
    if (nextIndex < currentItems.length - 1) {
      increment(nextIndex);
    }
  } else {
    listener.setHoverIndex(nextIndex);
  }
}

export function decrement(startFrom: number = -1) {
  const listener = getActiveStack();
  const currentItems = listener.getItems();
  const nextIndex = Math.max(
    0,
    (startFrom > -1 ? startFrom : listener.getHoverIndex()) - 1
  );
  if (!currentItems[nextIndex].isInteractive) {
    if (nextIndex > 0) {
      decrement(nextIndex);
    }
  } else {
    listener.setHoverIndex(nextIndex);
  }
}

const onSelect: onSelectHandler = (item: MenuItem) => {
  if (item.isInteractive) {
    item.execute();
    dispatch("select", item);
    if (trigger === "mouseup") {
      close(false);
    }
  }
};

const onDown = () => {
  if (trigger === "mousedown") {
    open();
  }
};

const onUp = () => {
  if (trigger === "mousedown") {
    close();
  }
};

const onToggle = (e: CustomEvent) => {
  if (trigger === "mouseup") {
    if (e.detail) {
      open();
    } else {
      close();
    }
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  const { key } = e;
  if (key === "ArrowUp" && isOpen) {
    decrement();
  } else if (key === "ArrowDown") {
    if (!isOpen) {
      open();
    } else if (isOpen) {
      increment();
    }
  } else if (isAcceptKey(key) && isOpen) {
    if (getActiveStack().getHoverIndex() > -1) {
      const item = getActiveStack().getCurrentItem();
      if (!item.hasSubMenu) {
        item.execute();
        dispatch("select", item);
      }
    }
  } else if (key === "Escape") {
    close();
  } else if (key === "ArrowLeft") {
    if (hasPreviousSubMenu() && getStack().length) {
      getActiveStack().setHoverIndex(-1);
      getActiveStack().isActive = false;
      // console.log("back");
    }
  } else if (key === "ArrowRight") {
    if (hasCurrentSubMenu()) {
      getStackTop().isActive = true;
      increment();
      // console.log("forward");
    }
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  if (button && !button.getIsDown().isDown && isAcceptKey(e.key)) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    close();
  }
};

const onShouldClose = () => {
  if (getActiveStack().getHoverIndex() > -1) {
    const item = getActiveStack().getCurrentItem();
    return !item.hasSubMenu;
  }
  return true;
};
</script>

<Menu
  bind:this="{menu}"
  isOpen="{isOpen}"
  items="{items}"
  position="{position}"
  trigger="{trigger}"
  selectedIndex="{selectedIndex}"
  stack="{stack}"
  onSelect="{onSelect}"
  ><Button
    bind:this="{button}"
    isEnabled="{isEnabled}"
    canToggle="{trigger === 'mouseup'}"
    noStyle="{noStyle}"
    customClasses="{customClasses}"
    onShouldClose="{onShouldClose}"
    on:push
    on:down="{onDown}"
    on:down
    on:up="{onUp}"
    on:up
    on:toggle="{onToggle}"
    on:toggle
    on:keydown
    on:keydown="{onKeyDown}"
    on:keyup
    on:keyup="{onKeyUp}"
    on:focus
    on:blur
    on:mouseover
    on:mouseout>
    <slot />
  </Button></Menu>
