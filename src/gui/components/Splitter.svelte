<script lang="ts">
import { onMount } from 'svelte';
import { Direction, getLocalStorage, setLocalStorage, Dragger } from '../';
import Icon from './Icon.svelte';

export let direction: Direction = 'horizontal';
export let value: number = 0.5;
export let storageKey: string = '';

const separatorSize = 5;
const dragger = new Dragger<number>();

let elementWidth: number;
let elementHeight: number;
let panel1: HTMLDivElement;
let panel2: HTMLDivElement;
let separator: HTMLDivElement;

function getLayout() {
  const panel1Size =
    (direction === 'horizontal' ? elementWidth : elementHeight) * value -
    separatorSize / 2;
  const panel2Size =
    (direction === 'horizontal' ? elementWidth : elementHeight) *
      (1.0 - value) -
    separatorSize / 2;
  return {
    panel1Size,
    separatorPos: panel1Size,
    panel2Size,
    panel2Pos: panel1Size + separatorSize,
  };
}

function setLayout() {
  const { panel1Size, separatorPos, panel2Size, panel2Pos } = getLayout();
  if (direction === 'horizontal') {
    panel1.style.width = `${panel1Size}px`;
    separator.style.left = `${separatorPos}px`;
    panel2.style.left = `${panel2Pos}px`;
    panel2.style.width = `${panel2Size}px`;
  } else if (direction === 'vertical') {
    panel1.style.height = `${panel1Size}px`;
    separator.style.top = `${separatorPos}px`;
    panel2.style.top = `${panel2Pos}px`;
    panel2.style.height = `${panel2Size}px`;
  }
}

onMount(() => {
  if (storageKey) {
    const storedValue = getLocalStorage(storageKey);
    if (storedValue !== null) {
      try {
        value = parseFloat(storedValue);
      } catch (e) {}
    }
  }
  setLayout();
});

dragger
  .on('dragstart', setSartValue => setSartValue(value))
  .on('dragmove', ({ deltaX, deltaY }) => {
    let limit = separatorSize / 2 / elementWidth;
    let newValue: number;
    if (direction === 'horizontal') {
      newValue = (elementWidth * dragger.startValue + deltaX) / elementWidth;
    } else if (direction === 'vertical') {
      newValue = (elementHeight * dragger.startValue + deltaY) / elementHeight;
      limit = separatorSize / elementWidth;
    }
    value = Math.min(Math.max(limit, newValue), 1 - limit);
    setLayout();
  })
  .on('dragcomplete', () => {
    if (storageKey) {
      setLocalStorage(storageKey, value);
    }
  });

$: {
  if (elementWidth > 0) {
    setLayout();
  }
}
</script>

<div
  bind:clientWidth="{elementWidth}"
  bind:clientHeight="{elementHeight}"
  class="splitter"
  class:horizontal="{direction === 'horizontal'}"
  class:vertical="{direction === 'vertical'}"
  data-component="splitter">
  <div bind:this="{panel1}" class="panel1"><slot name="panel1" /></div>
  <div
    bind:this="{separator}"
    class="separator"
    on:mousedown="{dragger.onStartDrag}">
    <div class="thumb">
      <Icon src="img/icons/splitter.svg" size="{16}" />
    </div>
  </div>
  <div bind:this="{panel2}" class="panel2"><slot name="panel2" /></div>
</div>

<style lang="scss">
@import '../theme';
$separatorSize: 5px;
$thumbSize: 20px;

.splitter {
  position: relative;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  box-sizing: border-box;

  .separator {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    .thumb {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #525252;
      border: 1px outset #919191;
      width: $separatorSize;
      height: $separatorSize;
      pointer-events: none;
      user-select: none;

      &:active {
        background-color: #424242;
      }

      :global([data-component='icon']) {
        opacity: 0.5;
      }
    }
  }

  &.horizontal {
    flex-direction: row;

    > .separator {
      @include linear_gradient(#494d52, #383c42, 90deg);
      width: $separatorSize;
      border-left: 1px solid #343333;
      border-right: 1px solid#646262;
      cursor: ew-resize;

      > .thumb {
        height: $thumbSize;
      }
    }
  }

  &.vertical {
    flex-direction: column;

    > .separator {
      @include linear_gradient(#494d52, #383c42, 180deg);
      height: $separatorSize;
      border-top: 1px solid #343333;
      border-bottom: 1px solid#646262;
      cursor: ns-resize;

      > .thumb {
        width: $thumbSize;
      }
    }
  }

  &.vertical > .separator > .thumb > :global(.icon) {
    transform: rotate(90deg);
  }
}

.panel1,
.panel2 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}
</style>
