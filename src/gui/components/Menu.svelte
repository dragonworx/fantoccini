<style lang="scss">
@import "../theme";

.menu {
  position: relative;
  display: flex;

  &.submenu {
    position: absolute;
  }

  &[data-position="popout"] .menu-position {
    z-index: 2;
  }

  & .menu-position {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
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
        display: flex;
        min-height: 26px;

        .menu-item {
          flex-grow: 1;
          padding: $spacing_small ($spacing_small * 2);
        }
      }

      :global(& [data-component="label"]) {
        font-size: 12px;
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

        :global(& [data-component="label"]) {
          text-shadow: none;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fade } from "svelte/transition";
import { MenuItem, MenuPosition, MenuTrigger } from "../types";
import Label from "../components/Label.svelte";

export let isEnabled: boolean = true;
export let options: MenuItem[];
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;
export let selectedIndex: number = -1;
export let hoverIndex: number = selectedIndex;
export let isSubMenu: boolean = false;

export function containsEvent(e: MouseEvent) {
  return menuViewEl.contains(e.target as Node);
}

export function clear() {
  hoverIndex = activeIndex = selectedIndex - 1;
}

let dispatch = createEventDispatcher();

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

export function setHoverIndex(index: number) {
  if (hoverIndex !== index) {
    hoverIndex = index;
    if (index > -1 && index !== activeIndex) {
      activeIndex = index;
    }
  }
  if (index === -1) {
    activeIndex = -1;
  }
}

function select(index: number) {
  hoverIndex = activeIndex = -1;
  dispatch("select", index);
}

const onLIMouseOver = (index: number) => (e: MouseEvent) => {
  setHoverIndex(index);
};

const onLIMouseUp = (index: number) => () => {
  if (trigger === "mousedown") {
    select(index);
  }
};

const onLIMouseDown = (index: number) => () => {
  if (trigger === "mouseup") {
    select(index);
  }
};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  bind:this="{containerEl}"
  class="menu"
  class:submenu="{isSubMenu}"
  data-component="menu"
  data-position="{position}">
  <slot />
  {#if isOpen}
    <div bind:this="{menuPositionEl}" class="menu-position">
      <ul
        class="menu-view"
        bind:this="{menuViewEl}"
        transition:fade="{{ duration: 150 }}"
        on:mouseover
        on:mouseout>
        {#each options as option, i (i)}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <li
            class:selected="{selectedIndex === i}"
            class:hover="{hoverIndex === i}"
            data-index="{i}"
            on:mouseover="{onLIMouseOver(i)}"
            on:mouseup="{onLIMouseUp(i)}"
            on:mousedown="{onLIMouseDown(i)}">
            {#if activeIndex === i && options[i].menu}
              <svelte:self
                options="{options[i].menu}"
                isOpen="{true}"
                isSubMenu="{true}"
                position="popout"
                ><div class="menu-item">
                  <Label text="{option.label}" />
                </div></svelte:self>
            {:else}
              <div class="menu-item">
                <Label text="{option.label}" />
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
