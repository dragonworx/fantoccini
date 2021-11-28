<style lang="scss">
main {
  position: relative;
  padding: 10px;
}

@media (min-width: 640px) {
  main {
    box-sizing: border-box;
    max-width: none;
  }
}
</style>

<script lang="ts">
import Section from "./examples/Section.svelte";
import Demo from "./examples/Demo.svelte";
import Area from "./examples/Area.svelte";
import Outline from "./examples/Outline.svelte";

import Label from "./gui/Label.svelte";
import Icon from "./gui/Icon.svelte";
import PushButton from "./gui/PushButton.svelte";
import Checkbox from "./gui/Checkbox.svelte";
import RadioGroup from "./gui/RadioGroup.svelte";

const radioOptions = [
  { label: "Option 1", value: "a" },
  { label: "Option 2", value: "b" },
  { label: "Option 3", value: "c" },
];

function log(component: string, event: string, data?: any) {
  console.log(
    `%c${component}:%c${event}: %c${data === undefined ? "" : data}`,
    "color:cyan",
    "color:yellow",
    "color:white"
  );
}
</script>

<main>
  <Section title="Label - Simple">
    <Label text="Default" />
    <Label isEnabled="{false}" text="Disabled" />
    <Outline>
      <Label
        text="Is Link"
        isLink="{true}"
        on:clicked="{() => log('label', 'clicked')}" />
    </Outline>
  </Section>
  <Section title="Label - Wrapping Left">
    <!-- Left -->
    <Demo key="align" value="left">
      <Label text="Text"><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
    <Demo key="align" value="center"
      ><Label text="Text" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
    <Demo key="align" value="end"
      ><Label text="Text" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
    <Demo key="indent" value="5"
      ><Label text="Text" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label
      ></Demo>
  </Section>
  <Section title="Label - Wrapping Right">
    <!-- Right -->
    <Demo key="align" value="start">
      <Label text="Text" position="right"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="center">
      <Label text="Text" position="right" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="end">
      <Label text="Text" position="right" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="indent" value="5">
      <Label text="Text" position="right" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
  </Section>
  <Section title="Label - Wrapping Top">
    <!-- Top -->
    <Demo key="align" value="start">
      <Label text="Text" position="top"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="center">
      <Label text="Text" position="top" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="end">
      <Label text="Text" position="top" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="indent" value="5">
      <Label text="Text" position="top" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
  </Section>
  <Section title="Label - Wrapping Bottom">
    <!-- Bottom -->
    <Demo key="align" value="start">
      <Label text="Text" position="bottom"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="center">
      <Label text="Text" position="bottom" align="center"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="align" value="end">
      <Label text="Text" position="bottom" align="end"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
    <Demo key="indent" value="5">
      <Label text="Text" position="bottom" indent="{5}"
        ><Icon src="img/test-small.png" width="{50}" /></Label>
    </Demo>
  </Section>
  <Section title="Button">
    <Area>
      <Outline>
        <PushButton
          label="Push it"
          on:down="{(e) => log('pushbutton', 'down', e.detail.isDown)}"
          on:up="{(e) => log('pushbutton', 'up', e.detail.isDown)}" />
      </Outline>
      <PushButton label="Push it" isEnabled="{false}" />
      <PushButton label="Push it" iconName="tick" />
    </Area>
    <Area>
      <Outline>
        <PushButton
          label="Toggle it"
          iconName="tick"
          canToggle="{true}"
          on:toggle="{(e) => log('pushbutton', 'toggle', e.detail.isDown)}" />
      </Outline>
      <PushButton
        label="Toggle it"
        iconName="tick"
        canToggle="{true}"
        isDown="{true}" />
      <PushButton
        isEnabled="{false}"
        label="Toggle it"
        iconName="tick"
        canToggle="{true}"
        isDown="{true}" />
    </Area>
  </Section>
  <Section title="Checkbox">
    <Area>
      <Outline>
        <Checkbox
          on:change="{(e) => log('checkbox', 'onchange', e.detail.checked)}" />
      </Outline>
      <Checkbox isDown="{true}" />
      <Checkbox isEnabled="{false}" />
      <Checkbox isEnabled="{false}" isDown="{true}" />
    </Area>
    <Area>
      <Outline>
        <Checkbox
          label="Left"
          on:change="{(e) => log('checkbox', 'onchange', e.detail.checked)}" />
      </Outline>
      <Checkbox label="Right" position="right" />
      <Checkbox label="Top" position="top" />
      <Checkbox label="Bottom" position="bottom" />
    </Area>
  </Section>
  <Section title="Radio">
    <Area>
      <Outline>
        <RadioGroup
          options="{radioOptions}"
          on:change="{(e) =>
            log('radio', 'onchange', e.detail.selectedIndex)}" />
      </Outline>
      <RadioGroup options="{radioOptions}" position="left" />
      <RadioGroup options="{radioOptions}" position="top" />
      <RadioGroup options="{radioOptions}" position="bottom" />
    </Area>
  </Section>
</main>
