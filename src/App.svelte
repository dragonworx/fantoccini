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
</script>

<main>
  <Section title="Label - Simple">
    <Label text="Default" />
    <Label isEnabled="{false}" text="Disabled" />
    <Label text="Is Link" isLink="{true}" />
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
      <PushButton label="Push it!" />
      <PushButton label="Push it!" isEnabled="{false}" />
      <PushButton label="Push it!" iconName="tick" />
      <PushButton label="Toggle it!" iconName="tick" canToggle="{true}" />
      <PushButton
        label="Toggle it!"
        iconName="tick"
        canToggle="{true}"
        isDown="{true}" />
      <PushButton
        isEnabled="{false}"
        label="Toggle it!"
        iconName="tick"
        canToggle="{true}"
        isDown="{true}" />
    </Area>
    <Area />
  </Section>
  <Section title="Checkbox">
    <Area>
      <Checkbox />
      <Checkbox isDown="{true}" />
      <Checkbox isEnabled="{false}" />
      <Checkbox isEnabled="{false}" isDown="{true}" />
    </Area>
    <Area>
      <Checkbox label="Left" />
      <Checkbox label="Right" position="right" />
      <Checkbox label="Top" position="top" />
      <Checkbox label="Bottom" position="bottom" />
    </Area>
  </Section>
  <Section title="Radio">
    <Area>
      <RadioGroup
        options="{radioOptions}"
        on:change="{(e) => console.log(e.detail.selectedIndex)}" />
      <RadioGroup options="{radioOptions}" position="left" />
      <RadioGroup options="{radioOptions}" position="top" />
      <RadioGroup options="{radioOptions}" position="bottom" />
    </Area>
  </Section>
</main>
