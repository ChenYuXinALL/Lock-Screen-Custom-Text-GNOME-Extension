# Lock Screen Custom Text

A professional GNOME Shell extension that allows you to display a custom, highly-configurable text message on your lock screen. 

Specifically optimized for **GNOME 46 and 47**.

## 🚀 Key Features

- **9-Point Alignment**: Precisely place your text in any corner or center of the screen using a grid-based alignment system (Top/Middle/Bottom × Left/Center/Right).
- **Fully Customizable Appearance**:
  - Adjust **Font Size** (10px to 200px).
  - Pick any **Text Color** via a native color dialog.
  - Advanced **Text Shadow** control (Blur radius and Shadow color).
- **Rock-Solid Stability**: 
  - Uses `Main.sessionMode` for persistent state management.
  - Implements `BindConstraint` to ensure layout consistency across different resolutions.
  - Proper memory management to prevent crashes during multiple lock/unlock cycles.

## 🛠 Installation

### Manual Installation
1. Move the folder to `~/.local/share/gnome-shell/extensions/`.
2. Ensure the folder name matches the UUID in `metadata.json`.
3. Compile the schemas:
   ```bash
   glib-compile-schemas schemas/
