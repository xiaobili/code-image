import { getSelectedText, showToast, Toast, showHUD, getPreferenceValues, Clipboard } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";
import { encodeURI } from "js-base64";
import axios from "axios";
import fs from "fs";
import { getNowTime } from "./utils/date";

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

  const base64Text = encodeURI(selectedText);

  await showToast(Toast.Style.Animated, "截图生成中");
  const url = preferences.raysoUrl;
  const data = {
    theme: preferences.theme,
    background: preferences.background,
    darkMode: preferences.darkMode,
    padding: preferences.padding,
    code: base64Text,
  };
  await axios
    .post(url, data, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
    .then(async (res) => {
      if (res.status === 200) {
        const fileName = `rayso_${getNowTime()}.png`;
        const filePath = `${preferences.SystemDirectory}/${fileName}`;
        fs.writeFileSync(filePath, res.data);

        if (preferences.CopyImage) {
          const file = filePath;
          const fileContent: Clipboard.Content = { file };
          await Clipboard.copy(fileContent);
          if (preferences.OpenDirectory) {
            console.log(preferences.SystemDirectory);
            // 讲路径修改为 AppleScript，打开文件夹并选中文件
            const script = `
              set folderPath to (POSIX file "${preferences.SystemDirectory}" as text)
              set targetFile to (POSIX file "${filePath}" as text)
              tell application "Finder"
                activate
                open folderPath
                select targetFile
              end tell
            `;
            runAppleScript(script);
          }
          await showToast(Toast.Style.Success, "截图生成成功");
          await showHUD("已复制到剪贴板");
        }
      }
    })
    .catch(async (e) => {
      await showToast(Toast.Style.Failure, e);
      await showHUD(e);
    });
};
