import { getSelectedText, showToast, Toast, showHUD, getPreferenceValues, Clipboard, showInFinder } from "@raycast/api";
import axios from "axios";
import fs from "fs";
import { getNowTime } from "./utils/date";
import { encodeURI } from "js-base64";

interface Preferences {
  theme: string;
  padding: number;
  darkMode: boolean;
  background: boolean;
  raysoUrl: string;
  SystemDirectory: string;
  OpenDirectory: boolean;
  CopyImage: boolean;
}

export default async () => {
  const preferences: Preferences = getPreferenceValues();
  let selectedText;
  try {
    selectedText = await getSelectedText();
  } catch (e) {
    await showHUD("截图生成失败。请确保您已选择要截屏的文本");
    return;
  }
  await showToast(Toast.Style.Animated, "截图生成中");
  const base64Text = encodeURI(selectedText);
  const url = preferences.raysoUrl;
  const data = {
    theme: preferences.theme,
    background: preferences.background,
    darkMode: preferences.darkMode,
    padding: preferences.padding,
    code: base64Text,
  };
  const resp = await axios.post(url, data, {
    responseType: "stream",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  if (resp.status === 200) {
    console.log("截图成功");
    const fileName = `rayso_${getNowTime()}.png`;
    const filePath = `${preferences.SystemDirectory}/${fileName}`;
    await fs.promises.writeFile(filePath, resp.data);
    await showToast(Toast.Style.Success, "截图生成成功");
    if (preferences.CopyImage) {
      const file = filePath;
      const fileContent: Clipboard.Content = { file };
      await Clipboard.copy(fileContent);
      await showHUD("已复制到剪贴板");
    }
    if (preferences.OpenDirectory) {
      await showInFinder(filePath);
    }
  } else {
    await showToast(Toast.Style.Failure, "截图生成失败");
  }
};
