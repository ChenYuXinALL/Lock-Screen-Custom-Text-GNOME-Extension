import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class MyLockScreenExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._label = null;

        // 核心：监听 SessionMode 变化。这是声明了 unlock-dialog 后的标准做法。
        this._modeId = Main.sessionMode.connect('updated', () => {
            this._syncUI();
        });

        // 绑定设置变化监听（只在 enable 时绑定一次）
        this._sigId = this._settings.connect('changed', () => {
            if (this._label) this._updateStyle();
        });

        // 初始化检查
        this._syncUI();
    }

    _syncUI() {
        const isLockMode = Main.sessionMode.currentMode === 'unlock-dialog';
        
        if (isLockMode) {
            // 进入锁屏模式：创建并挂载
            this._setupLabel();
        } else {
            // 回到用户模式：销毁并清理
            this._destroyLabel();
        }
    }

    _setupLabel() {
        // 关键：GNOME 46 的 dialog 对象在进入 unlock-dialog 模式后才会实例化
        const dialog = Main.screenShield._dialog;
        if (!dialog || this._label) return;

        this._label = new St.Label({ 
            style_class: 'custom-lock-label',
            reactive: false 
        });

        dialog.add_child(this._label);
        
        // 解决“不听指挥”：强制尺寸绑定
        this._label.add_constraint(new Clutter.BindConstraint({
            source: dialog,
            coordinate: Clutter.BindCoordinate.ALL,
        }));

        this._updateStyle();
    }

    _updateStyle() {
        if (!this._label || !this._settings) return;

        const hMap = [Clutter.ActorAlign.START, Clutter.ActorAlign.CENTER, Clutter.ActorAlign.END];
        const vMap = [Clutter.ActorAlign.START, Clutter.ActorAlign.CENTER, Clutter.ActorAlign.END];

        const text = this._settings.get_string('custom-text');
        const size = this._settings.get_int('font-size');
        const color = this._settings.get_string('text-color');
        const blur = this._settings.get_int('shadow-blur');
        const sColor = this._settings.get_string('shadow-color');
        const hIdx = this._settings.get_int('alignment');
        const vIdx = this._settings.get_int('v-alignment');

        this._label.set_text(text);
        this._label.set_style(
            `font-size: ${size}px; color: ${color}; ` +
            `text-shadow: 2px 2px ${blur}px ${sColor}; ` +
            `text-align: ${['left', 'center', 'right'][hIdx]}; ` +
            `padding: 50px;`
        );

        this._label.set_x_align(hMap[hIdx]);
        this._label.set_y_align(vMap[vIdx]);
        this._label.set_x_expand(true);
        this._label.set_y_expand(true);
    }

    _destroyLabel() {
        if (this._label) {
            this._label.destroy();
            this._label = null;
        }
    }

    disable() {
        if (this._modeId) Main.sessionMode.disconnect(this._modeId);
        if (this._sigId) this._settings.disconnect(this._sigId);
        this._destroyLabel();
        this._settings = null;
    }
}
