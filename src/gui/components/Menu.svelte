<style lang="scss">
@import "../theme";

.menu {
  position: relative;
  display: flex;

  & .menu-position {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    & .menu-view {
      @include linear_gradient(#24282f, #2f343c);
      @include button_border_up;
      border-bottom: none;
      box-shadow: -1px 5px 8px 1px rgba(0, 0, 0, 0.25);

      border-radius: $border_radius_tiny;
      list-style: none;
      margin: 0;
      padding: 0;

      & li {
        position: relative;
        min-height: 26px;
        box-sizing: border-box;
      }

      & li.separator {
        min-height: 2px;
        border-top: 1px solid #24272c;
        border-bottom: 1px solid #3d4147;
      }

      :global(& [data-component="label"]:focus) {
        outline: none;
      }

      & li.hover {
        @include linear_gradient(#6d7683, #5a5c5e, 180deg);
        outline: none;

        :global(& [data-component="label"]) {
          text-shadow: none;
        }
      }

      & li.selected {
        @include linear_gradient(#73849d, #3a556f, 180deg);
      }
    }
  }
}

:global([data-component="menu"] [data-component="label"]) {
  text-shadow: none;
}
</style>

<script lang="ts">
import {
  MenuItem,
  MenuPosition,
  MenuTrigger,
  MenuStackItem,
  onSelectHandler,
  nextId,
} from "../";
import MenuRow from "./MenuRow.svelte";

export let items: MenuItem[];
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;
export let selectedIndex: number = -1;
export let hoverIndex: number = selectedIndex;
export let stack: MenuStackItem[];
export let onSelect: onSelectHandler;

let id = nextId();

export function containsEvent(e: MouseEvent) {
  const r = menuViewEl.getBoundingClientRect();
  const { clientX: x, clientY: y } = e;
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

export function clear(fully: boolean = false) {
  activeIndex = -1;
  if (fully) {
    hoverIndex = selectedIndex - 1;
  }
}

export function registerStack() {
  const isActive = stack.length === 0;
  hoverIndex = -1;
  stack.push({
    isActive,
    setHoverIndex,
    getHoverIndex,
    hasCurrentSubMenu,
    getCurrentItem,
    getItems,
    containsEvent,
  });
  // console.log("register!", stack.length);
}

export function setHoverIndex(index: number) {
  if (hoverIndex !== index) {
    hoverIndex = index;
    if (index > -1 && index !== activeIndex) {
      if (activeIndex > -1 && items[activeIndex].hasSubMenu) {
        stack.pop();
        // console.log("leave", stack.length);
      }
      activeIndex = index;
      if (items[activeIndex].hasSubMenu) {
        // console.log("enter", stack.length);
      }
    }
  }
  if (index === -1) {
    activeIndex = -1;
  }
}

export function getHoverIndex() {
  return hoverIndex;
}

export function hasCurrentSubMenu() {
  return hoverIndex > -1 && items[hoverIndex].hasIteractiveSubMenu;
}

export function getCurrentItem() {
  return items[hoverIndex];
}

export function getItems() {
  return items;
}

let containerEl: HTMLDivElement;
let menuPositionEl: HTMLDivElement;
let menuViewEl: HTMLUListElement;
let activeIndex: number = -1;

$: {
  if (isOpen && containerEl && menuViewEl) {
    const containerRect = containerEl.getBoundingClientRect();
    const innerWidth = document.body.clientWidth;
    const innerHeight = document.body.clientHeight;

    let top: number;
    let left: number;

    if (position === "dropdown") {
      left = 0;
      top = containerRect.height;
    } else if (position === "popout") {
      left = containerRect.width;
      top = 0;
    }

    menuPositionEl.style.top = `${top}px`;
    menuPositionEl.style.left = `${left}px`;

    const menuViewRect = menuViewEl.getBoundingClientRect();

    if (menuViewRect.bottom > innerHeight) {
      menuPositionEl.style.top = `${
        containerRect.height -
        (containerRect.bottom + menuViewRect.height - innerHeight)
      }px`;
    }

    if (menuViewRect.right > innerWidth) {
      menuPositionEl.style.left = `${
        containerRect.width -
        (containerRect.right + menuViewRect.width - innerWidth)
      }px`;
    }
  }
}

$: {
  if (isOpen) {
    registerStack();
  }
}

$: {
  if (isOpen === false && stack.length) {
    clearStack();
  }
}

$: hasIcons = items.some((item) => item.hasIcon);
$: hasSubMenus = items.some((item) => item.hasSubMenu);
$: hasShortCuts = items.some((item) => item.hasShortcut);

function clearStack() {
  stack.length = 0;
  // console.log("clear");
}

function select(item: MenuItem) {
  if (item.canToggle && !item.hasAction) {
    item.isChecked = !item.isChecked;
  }
  onSelect(item);
}

const onLIMouseOver = (index: number) => (e: MouseEvent) => {
  if (items[index].isInteractive) {
    setHoverIndex(index);
  }
};

const onLIMouseUp = (index: number) => (e: MouseEvent) => {
  if (trigger === "mousedown") {
    if (containsEvent(e) && !items[index].hasSubMenu) {
      select(items[index]);
    }
  }
};

const onLIMouseDown = (index: number) => (e: MouseEvent) => {
  if (trigger === "mouseup") {
    if (containsEvent(e) && !items[index].hasSubMenu) {
      select(items[index]);
    }
  }
};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  bind:this="{containerEl}"
  class="menu"
  class:withIcons="{hasIcons}"
  class:withSubMenus="{hasSubMenus}"
  class:withShortCuts="{hasShortCuts}"
  data-component="menu"
  data-position="{position}">
  <slot />
  {#if isOpen}
    <div bind:this="{menuPositionEl}" class="menu-position">
      <ul class="menu-view" bind:this="{menuViewEl}" on:mouseover on:mouseout>
        {#each items as item, i (i)}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <li
            class:selected="{selectedIndex === i}"
            class:hover="{hoverIndex === i}"
            class:separator="{item.isSeparator}"
            data-index="{i}"
            on:mouseover="{onLIMouseOver(i)}"
            on:mouseup="{onLIMouseUp(i)}"
            on:mousedown="{onLIMouseDown(i)}">
            {#if item.isItem}
              {#if activeIndex === i && item.hasSubMenu}
                <svelte:self
                  items="{item.items}"
                  isOpen="{true}"
                  position="popout"
                  stack="{stack}"
                  onSelect="{onSelect}"
                  ><MenuRow
                    item="{item}"
                    hasIcons="{hasIcons}"
                    hasShortCuts="{hasShortCuts}" /></svelte:self>
              {:else}
                <MenuRow
                  item="{item}"
                  hasIcons="{hasIcons}"
                  hasShortCuts="{hasShortCuts}" />
              {/if}
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
