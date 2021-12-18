<style lang="scss">
@import "../theme";

.menu {
  position: relative;
  display: flex;

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
        padding: $spacing_small ($spacing_small * 2);

        .menu-subitem {
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

export function containsEvent(e: MouseEvent) {
  return menuViewEl.contains(e.target as Node);
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

function select(index: number) {
  dispatch("select", index);
}

function setHoverIndex(index: number) {
  if (hoverIndex !== index) {
    hoverIndex = index;
    if (index > -1 && index !== activeIndex) {
      activeIndex = index;
      console.log(index);
    }
  }
}

const onLIMouseOver = (index: number) => (e: MouseEvent) => {
  setHoverIndex(index);
};

const onLIMouseOut = (index: number) => (e: MouseEvent) => {
  setHoverIndex(-1);
};

const onLIMouseUp = (index: number) => () => {
  if (trigger === "mousedown") {
    hoverIndex = -1;
    select(index);
  }
};

const onLIMouseDown = (index: number) => () => {
  if (trigger === "mouseup") {
    hoverIndex = -1;
    select(index);
  }
};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  bind:this="{containerEl}"
  class="menu"
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
            on:mouseout="{onLIMouseOut(i)}"
            on:mouseup="{onLIMouseUp(i)}"
            on:mousedown="{onLIMouseDown(i)}">
            {#if activeIndex === i && options[i].menu}
              <svelte:self
                options="{options[i].menu}"
                isOpen="{true}"
                position="popout"
                ><div class="menu-subitem">
                  <Label text="{option.label}" />
                </div></svelte:self>
            {:else}
              <Label text="{option.label}" />
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
