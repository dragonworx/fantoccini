<style lang="scss">
@import "../theme";

.menu {
  position: relative;

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
        padding: $spacing_small;
      }

      :global(& [data-component="label"]) {
        font-size: 12px;
      }

      :global(& [data-component="label"]:focus) {
        outline: none;
      }

      & li.hover,
      & li:focus {
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
import { fade } from "svelte/transition";
import { MenuOption, MenuPosition } from "../types";
import Label from "../components/Label.svelte";

export let options: MenuOption[];
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;
export let selectedIndex: number = -1;

export function containsEvent(e: MouseEvent) {
  return menuViewDiv.contains(e.target as Node);
}

let hoverIndex: number = -1;

let containerDiv: HTMLDivElement;
let menuPositionDiv: HTMLDivElement;
let menuViewDiv: HTMLUListElement;

function getLabel(option: MenuOption) {
  if (typeof option === "string") {
    return option;
  } else {
    return option.label;
  }
}

$: {
  if (isOpen && containerDiv && menuViewDiv) {
    const containerRect = containerDiv.getBoundingClientRect();
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

    menuPositionDiv.style.top = `${top}px`;
    menuPositionDiv.style.left = `${left}px`;

    const menuViewRect = menuViewDiv.getBoundingClientRect();

    if (menuViewRect.bottom > innerHeight) {
      menuPositionDiv.style.top = `${
        containerRect.height -
        (containerRect.bottom + menuViewRect.height - innerHeight)
      }px`;
    }

    if (menuViewRect.right > innerWidth) {
      menuPositionDiv.style.left = `${
        containerRect.width -
        (containerRect.right + menuViewRect.width - innerWidth)
      }px`;
    }
  }
}

const onLIMouseOver = (index: number) => () => {
  hoverIndex = index;
};

const onLIMouseOut = (e: MouseEvent) => {
  hoverIndex = -1;
};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  bind:this="{containerDiv}"
  class="menu"
  data-component="menu"
  data-position="{position}">
  <slot />
  {#if isOpen}
    <div bind:this="{menuPositionDiv}" class="menu-position">
      <ul
        class="menu-view"
        bind:this="{menuViewDiv}"
        transition:fade="{{ duration: 150 }}"
        on:mouseover
        on:mouseout>
        {#each options as option, i (i)}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <li
            class:selected="{selectedIndex === i}"
            class:hover="{hoverIndex === i}"
            data-index="{i}"
            tabindex="0"
            on:mouseover="{onLIMouseOver(i)}"
            on:mouseout="{onLIMouseOut}">
            <Label text="{getLabel(option)}" />
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
