import { Action } from '../gui/action';
import { MenuBarItem, MenuItem, separator } from '../gui/menu';
import hub from 'src/core/hub';

const save = new MenuItem({
  label: 'Save',
  isEnabled: false,
  action: new Action('menu.file.save', 'Ctrl+S'),
});

hub.on('project.init', () => (save.isEnabled = true));

const fileMenu: MenuItem[] = [
  new MenuItem({
    label: 'New Project',
    action: new Action('menu.file.new.project', 'Ctrl+N'),
  }),
  separator,
  new MenuItem({
    label: 'Open Project',
    action: new Action('menu.file.open.project', 'Ctrl+O'),
  }),
  separator,
  save,
];

const menubar: MenuBarItem[] = [{ label: 'File', items: fileMenu }];

export default menubar;
