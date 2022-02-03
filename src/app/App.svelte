<script lang="ts">
import menubar from "./menubar";
import Panel from "../gui/components/Panel.svelte";
import Splitter from "../gui/components/Splitter.svelte";
import TabView from "../gui/components/TabView.svelte";
import TabDoc from "../gui/components/TabDoc.svelte";
import NewProjectDialog from "./dialogs/NewProject.svelte";
import Timeline from "./panels/Timeline.svelte";
import Assets from "./panels/Assets.svelte";
import Explorer from "./panels/Explorer.svelte";
import Properties from "./panels/Properties.svelte";
import Viewport from "./panels/Viewport.svelte";
</script>

<main>
  <Panel menuBar="{menubar}">
    <Splitter direction="vertical" storageKey="multi_timeline" value="{0.7}">
      <Panel slot="panel1">
        <Splitter
          direction="horizontal"
          storageKey="multi_properties"
          value="{0.7}">
          <Panel slot="panel1">
            <Splitter
              direction="horizontal"
              storageKey="multi_viewport"
              value="{0.3}">
              <Panel slot="panel1">
                <TabView on:change="{(e) => {}}" on:closing="{(e) => {}}">
                  <TabDoc title="Assets" isClosable="{false}"
                    ><Assets /></TabDoc>
                  <TabDoc title="Explorer" isClosable="{false}"
                    ><Explorer /></TabDoc>
                </TabView>
              </Panel>
              <Panel slot="panel2" title="Viewport"><Viewport /></Panel>
            </Splitter>
          </Panel>
          <Panel slot="panel2" title="Properties"><Properties /></Panel>
        </Splitter>
      </Panel>
      <Panel slot="panel2" title="Timeline"><Timeline /></Panel>
    </Splitter>
  </Panel>
  <NewProjectDialog />
</main>

<style lang="scss">
main {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  display: flex;
}

@media (min-width: 640px) {
  main {
    max-width: none;
  }
}
</style>
