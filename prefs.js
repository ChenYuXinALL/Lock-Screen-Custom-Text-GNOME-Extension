import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';

export default class MyPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup({ title: '内容与外观' });
        page.add(group);

        // 文本
        const textRow = new Adw.EntryRow({ title: '显示文本' });
        settings.bind('custom-text', textRow, 'text', Gio.SettingsBindFlags.DEFAULT);
        group.add(textRow);

        // 字号
        const sizeRow = new Adw.ActionRow({ title: '字体大小 (px)' });
        const sizeSpin = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({ lower: 10, upper: 200, step_increment: 1 }),
            valign: Gtk.Align.CENTER
        });
        settings.bind('font-size', sizeSpin, 'value', Gio.SettingsBindFlags.DEFAULT);
        sizeRow.add_suffix(sizeSpin);
        group.add(sizeRow);

        // 颜色组
        const colorGroup = new Adw.PreferencesGroup({ title: '颜色与阴影' });
        page.add(colorGroup);

        const colorRow = new Adw.ActionRow({ title: '文本颜色' });
        const colorBtn = new Gtk.ColorDialogButton({ dialog: new Gtk.ColorDialog(), valign: Gtk.Align.CENTER });
        let rgba = new Gdk.RGBA(); rgba.parse(settings.get_string('text-color'));
        colorBtn.set_rgba(rgba);
        colorBtn.connect('notify::rgba', () => settings.set_string('text-color', colorBtn.get_rgba().to_string()));
        colorRow.add_suffix(colorBtn);
        colorGroup.add(colorRow);

        const blurRow = new Adw.ActionRow({ title: '阴影模糊 (px)' });
        const blurSpin = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({ lower: 0, upper: 50, step_increment: 1 }),
            valign: Gtk.Align.CENTER
        });
        settings.bind('shadow-blur', blurSpin, 'value', Gio.SettingsBindFlags.DEFAULT);
        blurRow.add_suffix(blurSpin);
        colorGroup.add(blurRow);

        // 位置组
        const posGroup = new Adw.PreferencesGroup({ title: '位置设置' });
        page.add(posGroup);

        const hRow = new Adw.ComboRow({
            title: '水平位置',
            model: new Gtk.StringList({ strings: ['左', '中', '右'] }),
            selected: settings.get_int('alignment')
        });
        settings.bind('alignment', hRow, 'selected', Gio.SettingsBindFlags.DEFAULT);
        posGroup.add(hRow);

        const vRow = new Adw.ComboRow({
            title: '垂直位置',
            model: new Gtk.StringList({ strings: ['顶', '中', '底'] }),
            selected: settings.get_int('v-alignment')
        });
        settings.bind('v-alignment', vRow, 'selected', Gio.SettingsBindFlags.DEFAULT);
        posGroup.add(vRow);
    }
}
