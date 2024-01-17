/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `rayso` command */
  export type Rayso = ExtensionPreferences & {
  /** Theme - Change the background color */
  "theme": "candy" | "breeze" | "crimson" | "falcon" | "meadow" | "midnight" | "raindrop" | "sunset",
  /** Padding - Set the padding around the code */
  "padding": "16" | "32" | "64" | "128",
  /** Dark Mode - Set the theme to light or dark mode */
  "darkMode": boolean,
  /** Background - Select whether you want a gradient background or not */
  "background": boolean,
  /** Ray.so URL - Set the URL of the Ray.so instance you want to use */
  "raysoUrl": string,
  /** System Directory - Set the directory of the System username instance you want to use */
  "SystemDirectory": string,
  /** Open Directory - Open Directory */
  "OpenDirectory": boolean,
  /** Copy Image - Copy Image */
  "CopyImage": boolean
}
}

declare namespace Arguments {
  /** Arguments passed to the `rayso` command */
  export type Rayso = {}
}

